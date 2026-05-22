const { Schema } = require("mongoose");

const OrdersSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    mode: { type: String, enum: ["BUY", "SELL"], required: true },
    orderType: { type: String, enum: ["MARKET", "LIMIT"], default: "MARKET" },
    status: {
      type: String,
      enum: ["COMPLETED", "PENDING", "CANCELLED"],
      default: "COMPLETED",
    },
    total: { type: Number },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: "orders" }
);

module.exports = { OrdersSchema };
