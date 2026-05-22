const STOCK_CATALOG = [
  { symbol: "INFY", sector: "IT", price: 1555.45 },
  { symbol: "TCS", sector: "IT", price: 3194.8 },
  { symbol: "WIPRO", sector: "IT", price: 577.75 },
  { symbol: "KPITTECH", sector: "IT", price: 266.45 },
  { symbol: "HDFCBANK", sector: "Banking", price: 1522.35 },
  { symbol: "SBIN", sector: "Banking", price: 430.2 },
  { symbol: "RELIANCE", sector: "Energy", price: 2112.4 },
  { symbol: "TATAPOWER", sector: "Energy", price: 124.15 },
  { symbol: "ONGC", sector: "Energy", price: 116.8 },
  { symbol: "ITC", sector: "FMCG", price: 207.9 },
  { symbol: "HINDUNILVR", sector: "FMCG", price: 2417.4 },
  { symbol: "HUL", sector: "FMCG", price: 512.4 },
  { symbol: "BHARTIARTL", sector: "Telecom", price: 541.15 },
  { symbol: "M&M", sector: "Auto", price: 779.8 },
];

const uniqueCatalog = [];
const seen = new Set();
for (const s of STOCK_CATALOG) {
  if (!seen.has(s.symbol)) {
    seen.add(s.symbol);
    uniqueCatalog.push(s);
  }
}

const SECTOR_MAP = Object.fromEntries(
  uniqueCatalog.map((s) => [s.symbol, s.sector])
);

const BASE_PRICES = Object.fromEntries(
  uniqueCatalog.map((s) => [s.symbol, s.price])
);

const DEFAULT_WATCHLIST = [
  "INFY",
  "TCS",
  "RELIANCE",
  "HDFCBANK",
  "WIPRO",
  "KPITTECH",
  "M&M",
  "HUL",
];

module.exports = {
  STOCK_CATALOG: uniqueCatalog,
  SECTOR_MAP,
  BASE_PRICES,
  DEFAULT_WATCHLIST,
};
