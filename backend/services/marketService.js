const {
  STOCK_CATALOG,
  BASE_PRICES,
  SECTOR_MAP,
} = require("../data/stockCatalog");

let livePrices = { ...BASE_PRICES };
let priceHistory = {};

function initPriceHistory() {
  STOCK_CATALOG.forEach((s) => {
    priceHistory[s.symbol] = [s.price];
  });
}

initPriceHistory();

function tickPrices() {
  const updated = {};
  for (const symbol of Object.keys(livePrices)) {
    const current = livePrices[symbol];
    const change = (Math.random() - 0.5) * 0.02;
    const next = Math.max(1, current * (1 + change));
    updated[symbol] = Number(next.toFixed(2));
    priceHistory[symbol] = [...(priceHistory[symbol] || []), updated[symbol]].slice(-30);
  }
  livePrices = updated;
  return livePrices;
}

function getLivePrice(symbol) {
  return livePrices[symbol] ?? BASE_PRICES[symbol] ?? 0;
}

function getAllMarketData() {
  return STOCK_CATALOG.map((stock) => {
    const price = getLivePrice(stock.symbol);
    const prev = priceHistory[stock.symbol]?.[0] ?? price;
    const change = ((price - prev) / prev) * 100;
    return {
      symbol: stock.symbol,
      sector: stock.sector,
      price,
      percent: `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`,
      isDown: change < 0,
    };
  });
}

function searchStocks(query) {
  const q = (query || "").trim().toUpperCase();
  if (!q) return STOCK_CATALOG;
  return STOCK_CATALOG.filter(
    (s) => s.symbol.includes(q) || s.sector.toUpperCase().includes(q)
  );
}

module.exports = {
  tickPrices,
  getLivePrice,
  getAllMarketData,
  searchStocks,
  SECTOR_MAP,
  STOCK_CATALOG,
  livePrices,
};
