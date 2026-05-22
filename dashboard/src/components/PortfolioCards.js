import React from "react";
import { formatINR } from "../utils/portfolio";

const PortfolioCards = ({ analytics }) => {
  if (!analytics) return null;

  const pnlClass = analytics.totalPnl >= 0 ? "profit" : "loss";

  return (
    <div className="portfolio-cards">
      <div className="portfolio-card">
        <p className="card-label">Total investment</p>
        <h4>{formatINR(analytics.totalInvestment)}</h4>
      </div>
      <div className="portfolio-card">
        <p className="card-label">Current value</p>
        <h4>{formatINR(analytics.totalCurrentValue)}</h4>
      </div>
      <div className="portfolio-card">
        <p className="card-label">Total P&L</p>
        <h4 className={pnlClass}>
          {analytics.totalPnl >= 0 ? "+" : ""}
          {formatINR(analytics.totalPnl)} ({analytics.totalPnlPercent.toFixed(2)}%)
        </h4>
      </div>
      <div className="portfolio-card">
        <p className="card-label">Diversification</p>
        <h4>{analytics.diversificationScore}/100</h4>
      </div>
    </div>
  );
};

export default PortfolioCards;
