require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UserModel } = require("./model/UserModel");
const { seedHoldings, seedPositions } = require("./data/seedData");
const { hashPassword, verifyPassword, isBcryptHash } = require("./utils/password");

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
      console.log("User accounts will be saved to the 'users' collection");
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
  console.error(
    "Could not connect to MongoDB. Sign up / sign in will not work until the cluster is reachable."
  );
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

    console.log(`New user saved to MongoDB: ${email} (${user._id})`);

    res.status(201).json({
      success: true,
      savedToDatabase: true,
      userId: user._id.toString(),
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
      console.log(`Upgraded password hash for: ${email}`);
    }

    res.json({
      success: true,
      savedToDatabase: true,
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

app.get("/allHoldings", async (req, res) => {
  try {
    if (dbConnected) {
      const allHoldings = await HoldingsModel.find({});
      if (allHoldings.length > 0) {
        return res.json(allHoldings);
      }
    }
    res.json(seedHoldings);
  } catch (err) {
    console.error("Holdings error:", err);
    res.json(seedHoldings);
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
    console.error("Positions error:", err);
    res.json(seedPositions);
  }
});

app.get("/allOrders", async (req, res) => {
  try {
    const { userId } = req.query;

    if (dbConnected) {
      const filter = userId ? { userId } : {};
      const orders = await OrdersModel.find(filter).sort({
        createdAt: -1,
        _id: -1,
      });
      return res.json(orders);
    }

    const filtered = userId
      ? memoryOrders.filter((o) => o.userId === userId)
      : memoryOrders;
    res.json([...filtered].reverse());
  } catch (err) {
    console.error("Orders fetch error:", err);
    res.json([]);
  }
});

app.post("/newOrder", async (req, res) => {
  try {
    const { name, qty, price, mode, userId } = req.body;

    if (!name || !qty || price === undefined || !mode) {
      return res.status(400).json({ message: "Missing order fields" });
    }

    if (!userId) {
      return res.status(400).json({ message: "userId is required to place an order" });
    }

    const order = {
      name,
      qty: Number(qty),
      price: Number(price),
      mode,
      userId,
      createdAt: new Date(),
    };

    if (dbConnected) {
      const newOrder = new OrdersModel(order);
      const saved = await newOrder.save();
      return res.json({
        success: true,
        message: "Order saved!",
        order: saved,
      });
    }

    const saved = { _id: `ord_${Date.now()}`, ...order };
    memoryOrders.push(saved);
    res.json({ success: true, message: "Order saved!", order: saved });
  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ message: "Failed to save order" });
  }
});

mongoose.connection.on("disconnected", () => {
  dbConnected = false;
  console.warn("MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  dbConnected = true;
  console.log("MongoDB reconnected");
});

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    if (dbConnected) {
      console.log("Auth: sign up & sign in → MongoDB Atlas (users collection)");
    }
  });
}

startServer();
