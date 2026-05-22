import React from "react";

const InsightsPanel = ({ analytics }) => {
  if (!analytics) return null;

  return (
    <div className="insights-panel">
      <h4 className="section-subtitle">Portfolio insights</h4>
      <div className="risk-badges">
        <span className="risk-badge">Risk: {analytics.riskLevel}</span>
        <span className="risk-badge good">
          Diversification: {analytics.diversificationScore}/100
        </span>
      </div>
      <ul className="insights-list">
        {analytics.insights?.map((text, i) => (
          <li key={i}>{text}</li>
        ))}
      </ul>
      {analytics.bestStock && (
        <p className="insight-meta">
          Best: <strong>{analytics.bestStock.symbol}</strong> · Worst:{" "}
          <strong>{analytics.worstStock?.symbol || "—"}</strong>
        </p>
      )}
    </div>
  );
};

export default InsightsPanel;
