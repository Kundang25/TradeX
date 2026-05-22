const { Schema } = require("mongoose");

const WatchlistSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true },
    pinned: { type: Boolean, default: false },
    addedAt: { type: Date, default: Date.now },
  },
  { collection: "watchlists" }
);

WatchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

module.exports = { WatchlistSchema };
