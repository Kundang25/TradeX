import React from "react";
import { Link } from "react-router-dom";
import { formatINR } from "../utils/portfolio";

const PnlHeatmap = ({ holdings }) => {
  if (!holdings?.length) return null;

  const maxInv = Math.max(...holdings.map((h) => h.investment), 1);

  return (
    <div className="pnl-heatmap">
      <h4 className="section-subtitle">P&L heatmap</h4>
      <div className="heatmap-grid">
        {holdings.map((h) => {
          const size = Math.max(80, (h.investment / maxInv) * 160);
          return (
            <Link
              to={`/ticker/${h.symbol}`}
              key={h.symbol}
              className={`heatmap-tile ${h.pnl >= 0 ? "tile-profit" : "tile-loss"}`}
              style={{ minHeight: size }}
            >
              <span className="tile-symbol">{h.symbol}</span>
              <span className="tile-pnl">{formatINR(h.pnl)}</span>
              <span className="tile-pct">{h.net}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PnlHeatmap;
