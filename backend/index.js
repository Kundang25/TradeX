require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/ordersModel");
const { UserModel } = require("./model/UserModel");
const { seedPositions } = require("./data/seedData");
const { hashPassword, verifyPassword, isBcryptHash } = require("./utils/password");
const { tickPrices, getAllMarketData, searchStocks } = require("./services/marketService");
const portfolioService = require("./services/portfolioService");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

app.use(cors());
app.use(express.json());

let dbConnected = false;
const memoryOrders = [];

const mongooseOptions = {
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 45000,
};

async function connectDB() {
  if (!uri) {
    console.error("MONGO_URL is missing in backend/.env");
    return;
  }

  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await mongoose.connect(uri, mongooseOptions);
      dbConnected = true;
      console.log(`MongoDB connected — database: ${mongoose.connection.name}`);
      return;
    } catch (err) {
      console.warn(
        `MongoDB connection attempt ${attempt}/${maxAttempts} failed:`,
        err.message
      );
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }
  dbConnected = false;
}

function requireDatabase(req, res, next) {
  if (!dbConnected) {
    return res.status(503).json({
      message:
        "Database is not connected. Check MONGO_URL in backend/.env and restart the server.",
      dbConnected: false,
    });
  }
  next();
}

function requireUserId(req, res, next) {
  const userId = req.query.userId || req.body.userId;
  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }
  req.userId = userId;
  next();
}

// --- Auth ---
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    dbConnected,
    database: dbConnected ? mongoose.connection.name : null,
  });
});

app.post("/api/signup", requireDatabase, async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const hashedPassword = await hashPassword(password);
    const user = new UserModel({ name, email, password: hashedPassword });
    await user.save();

    const userId = user._id.toString();
    await portfolioService.ensureFunds(userId, true);

    res.status(201).json({
      success: true,
      userId,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "User already exists with this email" });
    }
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
});

app.post("/api/login", requireDatabase, async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!isBcryptHash(user.password)) {
      user.password = await hashPassword(password);
      await user.save();
    }

    res.json({
      success: true,
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

// --- Market (live simulation) ---
app.get("/api/market", (req, res) => {
  res.json(getAllMarketData());
});

app.get("/api/market/search", (req, res) => {
  res.json(searchStocks(req.query.q));
});

// --- Portfolio ---
app.get("/api/portfolio/summary", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const summary = await portfolioService.getPortfolioSummary(userId, dbConnected);
    res.json(summary);
  } catch (err) {
    console.error("Portfolio summary error:", err);
    res.status(500).json({ message: "Failed to load portfolio" });
  }
});

app.get("/allHoldings", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const holdings = await portfolioService.getEnrichedHoldings(
      userId,
      dbConnected
    );
    res.json(holdings);
  } catch (err) {
    console.error("Holdings error:", err);
    res.status(500).json({ message: "Failed to load holdings" });
  }
});

app.get("/api/funds", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const funds = await portfolioService.ensureFunds(userId, dbConnected);
    res.json(funds);
  } catch (err) {
    res.status(500).json({ message: "Failed to load funds" });
  }
});

app.patch("/api/funds", async (req, res) => {
  try {
    const { userId, availableCash } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const funds = await portfolioService.ensureFunds(userId, dbConnected);
    if (availableCash !== undefined) {
      funds.availableCash = Number(availableCash);
      if (dbConnected) {
        const { FundsModel } = require("./model/FundsModel");
        await FundsModel.findOneAndUpdate({ userId }, funds, { upsert: true });
      }
    }
    res.json(funds);
  } catch (err) {
    res.status(500).json({ message: "Failed to update funds" });
  }
});

// --- Watchlist ---
app.get("/api/watchlist", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const list = await portfolioService.getWatchlist(userId, dbConnected);
    const market = getAllMarketData();
    const enriched = list.map((w) => {
      const m = market.find((x) => x.symbol === w.symbol);
      return { ...w, ...m };
    });
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: "Failed to load watchlist" });
  }
});

app.post("/api/watchlist", async (req, res) => {
  try {
    const { userId, symbol } = req.body;
    if (!userId || !symbol) {
      return res.status(400).json({ message: "userId and symbol required" });
    }
    await portfolioService.addToWatchlist(userId, symbol.toUpperCase(), dbConnected);
    res.json({ success: true, symbol });
  } catch (err) {
    res.status(500).json({ message: "Failed to add to watchlist" });
  }
});

app.delete("/api/watchlist/:symbol", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    await portfolioService.removeFromWatchlist(
      userId,
      req.params.symbol.toUpperCase(),
      dbConnected
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove from watchlist" });
  }
});

// --- Orders ---
app.get("/allOrders", async (req, res) => {
  try {
    const { userId, mode, status } = req.query;
    const filter = {};
    if (userId) filter.userId = userId;
    if (mode) filter.mode = mode;
    if (status) filter.status = status;

    if (dbConnected) {
      const orders = await OrdersModel.find(filter).sort({
        createdAt: -1,
        _id: -1,
      });
      return res.json(orders);
    }

    let list = [...memoryOrders];
    if (userId) list = list.filter((o) => o.userId === userId);
    if (mode) list = list.filter((o) => o.mode === mode);
    if (status) list = list.filter((o) => o.status === status);
    res.json(list.reverse());
  } catch (err) {
    res.json([]);
  }
});

app.post("/newOrder", async (req, res) => {
  try {
    const {
      name,
      symbol,
      qty,
      price,
      mode,
      userId,
      orderType = "MARKET",
    } = req.body;

    const stockSymbol = (symbol || name)?.toUpperCase();
    if (!stockSymbol || !qty || price === undefined || !mode || !userId) {
      return res.status(400).json({ message: "Missing order fields" });
    }

    const orderData = await portfolioService.executeOrder(
      {
        userId,
        symbol: stockSymbol,
        qty: Number(qty),
        price: Number(price),
        mode,
        orderType,
      },
      dbConnected
    );

    if (dbConnected) {
      const saved = await OrdersModel.create(orderData);
      return res.json({
        success: true,
        message: "Order executed!",
        order: saved,
        portfolio: await portfolioService.getPortfolioSummary(userId, true),
      });
    }

    const saved = { _id: `ord_${Date.now()}`, ...orderData };
    memoryOrders.push(saved);
    res.json({
      success: true,
      message: "Order executed!",
      order: saved,
      portfolio: await portfolioService.getPortfolioSummary(userId, false),
    });
  } catch (err) {
    console.error("Order error:", err);
    res.status(400).json({ message: err.message || "Failed to execute order" });
  }
});

app.get("/allPositions", async (req, res) => {
  try {
    if (dbConnected) {
      const allPositions = await PositionsModel.find({});
      if (allPositions.length > 0) {
        return res.json(allPositions);
      }
    }
    res.json(seedPositions);
  } catch (err) {
    res.json(seedPositions);
  }
});

mongoose.connection.on("disconnected", () => {
  dbConnected = false;
});

setInterval(() => {
  tickPrices();
}, 3000);

async function startServer() {
  await connectDB();
  tickPrices();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log("Paper trading engine + live price simulation (3s)");
  });
}

startServer();
