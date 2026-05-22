const { HoldingsModel } = require("../model/HoldingsModel");
const { OrdersModel } = require("../model/ordersModel");
const { FundsModel } = require("../model/FundsModel");
const { WatchlistModel } = require("../model/WatchlistModel");
const {
  enrichHolding,
  computeAnalytics,
  getTopMovers,
} = require("../utils/portfolioMath");
const { SECTOR_MAP, DEFAULT_WATCHLIST } = require("../data/stockCatalog");
const { getLivePrice } = require("./marketService");
const { seedHoldings } = require("../data/seedData");

const memoryHoldings = new Map();
const memoryFunds = new Map();
const memoryWatchlists = new Map();

function getSector(symbol) {
  return SECTOR_MAP[symbol] || "Other";
}

async function ensureFunds(userId, dbConnected) {
  if (dbConnected) {
    let funds = await FundsModel.findOne({ userId });
    if (!funds) {
      funds = await FundsModel.create({ userId, availableCash: 100000 });
    }
    return funds.toObject();
  }
  if (!memoryFunds.has(userId)) {
    memoryFunds.set(userId, { userId, availableCash: 100000, usedMargin: 0 });
  }
  return memoryFunds.get(userId);
}

async function seedDemoHoldings(userId, dbConnected) {
  const demo = seedHoldings.slice(0, 5).map((h) => ({
    userId,
    symbol: h.name,
    qty: h.qty,
    avgPrice: h.avg,
    currentPrice: h.price,
    sector: getSector(h.name),
    previousClose: h.avg,
  }));

  if (dbConnected) {
    await HoldingsModel.insertMany(demo);
    return demo;
  }
  memoryHoldings.set(userId, demo);
  return demo;
}

function normalizeRaw(h) {
  const o = h.toObject ? h.toObject() : h;
  return {
    ...o,
    symbol: o.symbol || o.name,
    avgPrice: o.avgPrice ?? o.avg,
    currentPrice: o.currentPrice ?? o.price,
  };
}

async function getHoldingsRaw(userId, dbConnected) {
  if (dbConnected) {
    let rows = await HoldingsModel.find({ userId });
    if (rows.length === 0) {
      await seedDemoHoldings(userId, true);
      rows = await HoldingsModel.find({ userId });
    }
    return rows.map(normalizeRaw);
  }
  if (!memoryHoldings.has(userId)) {
    await seedDemoHoldings(userId, false);
  }
  return memoryHoldings.get(userId) || [];
}

function setMemoryHoldings(userId, rows) {
  memoryHoldings.set(userId, rows);
}

async function getEnrichedHoldings(userId, dbConnected) {
  const raw = await getHoldingsRaw(userId, dbConnected);
  return raw.map((h) =>
    enrichHolding(h, getLivePrice(h.symbol || h.name))
  );
}

async function getPortfolioSummary(userId, dbConnected) {
  const holdings = await getEnrichedHoldings(userId, dbConnected);
  const analytics = computeAnalytics(holdings);
  const movers = getTopMovers(holdings);
  const funds = await ensureFunds(userId, dbConnected);
  return { holdings, analytics, movers, funds };
}

async function executeOrder(
  { userId, symbol, qty, price, mode, orderType },
  dbConnected
) {
  const total = qty * price;
  const funds = await ensureFunds(userId, dbConnected);

  if (mode === "BUY" && funds.availableCash < total) {
    throw new Error("Insufficient funds for this order");
  }

  const raw = await getHoldingsRaw(userId, dbConnected);
  raw.forEach((h, i) => {
    if (!h.symbol) raw[i].symbol = h.name;
    if (!h.avgPrice) raw[i].avgPrice = h.avg;
  });
  const idx = raw.findIndex((h) => h.symbol === symbol);

  if (mode === "SELL") {
    const holding = idx >= 0 ? raw[idx] : null;
    if (!holding || holding.qty < qty) {
      throw new Error("Insufficient quantity to sell");
    }
  }

  if (mode === "BUY") {
    if (idx >= 0) {
      const h = raw[idx];
      const oldAvg = h.avgPrice ?? h.avg;
      const newQty = h.qty + qty;
      const newAvg = (h.qty * oldAvg + qty * price) / newQty;
      h.qty = newQty;
      h.avgPrice = newAvg;
      h.avg = newAvg;
      h.currentPrice = price;
      h.previousClose = h.previousClose || price;
    } else {
      raw.push({
        userId,
        symbol,
        qty,
        avgPrice: price,
        currentPrice: price,
        sector: getSector(symbol),
        previousClose: price,
      });
    }
    funds.availableCash -= total;
  } else {
    const h = raw[idx];
    h.qty -= qty;
    if (h.qty <= 0) raw.splice(idx, 1);
    funds.availableCash += total;
  }

  const holdingFilter = { userId, $or: [{ symbol }, { name: symbol }] };

  if (dbConnected) {
    const holding = raw.find((x) => (x.symbol || x.name) === symbol);
    if (mode === "BUY") {
      if (holding) {
        await HoldingsModel.findOneAndUpdate(
          holdingFilter,
          {
            symbol,
            qty: holding.qty,
            avgPrice: holding.avgPrice,
            currentPrice: price,
            sector: holding.sector || getSector(symbol),
          },
          { upsert: false }
        );
      } else {
        await HoldingsModel.create({
          userId,
          symbol,
          qty,
          avgPrice: price,
          currentPrice: price,
          sector: getSector(symbol),
          previousClose: price,
        });
      }
    } else {
      if (holding && holding.qty > 0) {
        await HoldingsModel.findOneAndUpdate(holdingFilter, {
          symbol,
          qty: holding.qty,
          currentPrice: price,
        });
      } else {
        await HoldingsModel.deleteOne(holdingFilter);
      }
    }
    await FundsModel.findOneAndUpdate({ userId }, funds, { upsert: true });
  } else {
    setMemoryHoldings(userId, raw);
    memoryFunds.set(userId, funds);
  }

  const order = {
    userId,
    name: symbol,
    qty,
    price,
    mode,
    orderType: orderType || "MARKET",
    status: "COMPLETED",
    total,
    createdAt: new Date(),
  };

  return order;
}

async function getWatchlist(userId, dbConnected) {
  if (dbConnected) {
    let items = await WatchlistModel.find({ userId }).sort({ pinned: -1, addedAt: -1 });
    if (items.length === 0) {
      const docs = DEFAULT_WATCHLIST.map((symbol) => ({
        userId,
        symbol,
        pinned: false,
      }));
      await WatchlistModel.insertMany(docs);
      items = await WatchlistModel.find({ userId });
    }
    return items.map((w) => w.toObject());
  }
  if (!memoryWatchlists.has(userId)) {
    memoryWatchlists.set(
      userId,
      DEFAULT_WATCHLIST.map((symbol) => ({ userId, symbol, pinned: false }))
    );
  }
  return memoryWatchlists.get(userId);
}

async function addToWatchlist(userId, symbol, dbConnected) {
  if (dbConnected) {
    const doc = await WatchlistModel.findOneAndUpdate(
      { userId, symbol },
      { userId, symbol },
      { upsert: true, new: true }
    );
    return doc.toObject();
  }
  const list = memoryWatchlists.get(userId) || [];
  if (!list.find((w) => w.symbol === symbol)) {
    list.push({ userId, symbol, pinned: false });
    memoryWatchlists.set(userId, list);
  }
  return { userId, symbol };
}

async function removeFromWatchlist(userId, symbol, dbConnected) {
  if (dbConnected) {
    await WatchlistModel.deleteOne({ userId, symbol });
    return;
  }
  const list = (memoryWatchlists.get(userId) || []).filter(
    (w) => w.symbol !== symbol
  );
  memoryWatchlists.set(userId, list);
}

module.exports = {
  getEnrichedHoldings,
  getPortfolioSummary,
  executeOrder,
  ensureFunds,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  memoryHoldings,
};
