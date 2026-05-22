const { model } = require("mongoose");
const { WatchlistSchema } = require("../schemas/WatchlistSchema");

const WatchlistModel = model("Watchlist", WatchlistSchema);

module.exports = { WatchlistModel };
