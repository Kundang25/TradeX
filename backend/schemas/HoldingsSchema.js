const { Schema } = require("mongoose");

const HoldingsSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true },
    qty: { type: Number, required: true, default: 0 },
    avgPrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    sector: { type: String, default: "Other" },
    previousClose: { type: Number },
  },
  { timestamps: true, collection: "holdings" }
);

HoldingsSchema.index({ userId: 1, symbol: 1 }, { unique: true });

module.exports = { HoldingsSchema };
