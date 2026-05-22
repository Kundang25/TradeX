const { Schema } = require("mongoose");

const FundsSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    availableCash: { type: Number, default: 100000 },
    usedMargin: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "funds" }
);

module.exports = { FundsSchema };
