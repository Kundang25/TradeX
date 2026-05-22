import React, { useContext, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useMarketStore } from "../store/useMarketStore";
import GeneralContext from "./GeneralContext";
import { formatINR } from "../utils/portfolio";

const StockDetail = () => {
  const { symbol } = useParams();
  const { market, portfolio } = useMarketStore();
  const { openBuyWindow, openSellWindow } = useContext(GeneralContext);

  const stock = market.find((s) => s.symbol === symbol?.toUpperCase());
  const holding = portfolio?.holdings?.find(
    (h) => h.symbol === symbol?.toUpperCase()
  );

  const priceHistory = useMemo(() => {
    const base = stock?.price || 1000;
    return Array.from({ length: 20 }, (_, i) => ({
      t: i,
      price: Number((base * (1 + (Math.random() - 0.5) * 0.05)).toFixed(2)),
    }));
  }, [stock?.price, symbol]);

  if (!stock) {
    return (
      <div className="stock-detail">
        <p>Stock not found.</p>
        <Link to="/">Back to dashboard</Link>
      </div>
    );
  }

  return (
    <div className="stock-detail">
      <Link to="/" className="back-link">
        ← Dashboard
      </Link>
      <div className="stock-detail-header">
        <div>
          <h2>{stock.symbol}</h2>
          <span className="sector-tag">{stock.sector}</span>
          <p className={stock.isDown ? "loss" : "profit"}>{stock.percent} today</p>
        </div>
        <div className="stock-price-block">
          <h3>{formatINR(stock.price)}</h3>
          <div className="stock-actions">
            <button
              type="button"
              className="btn btn-blue"
              onClick={() => openBuyWindow(stock.symbol, stock.price)}
            >
              Buy
            </button>
            <button
              type="button"
              className="btn btn-sell-inline"
              onClick={() => openSellWindow(stock.symbol, stock.price)}
            >
              Sell
            </button>
          </div>
        </div>
      </div>

      {holding && (
        <div className="holding-stats">
          <p>
            You hold <strong>{holding.qty}</strong> @ avg {formatINR(holding.avgPrice)} ·
            P&L <span className={holding.pnl >= 0 ? "profit" : "loss"}>
              {formatINR(holding.pnl)} ({holding.net})
            </span>
          </p>
        </div>
      )}

      <div className="line-chart-panel">
        <h4>Price chart (simulated)</h4>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={priceHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="t" hide />
            <YAxis domain={["auto", "auto"]} tickFormatter={(v) => `₹${v}`} />
            <Tooltip formatter={(v) => formatINR(v)} />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#4184f3"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockDetail;
