import React from "react";

const SummarySkeleton = () => (
  <div className="skeleton-wrap">
    <div className="skeleton-line wide" />
    <div className="portfolio-cards">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton-card" />
      ))}
    </div>
    <div className="skeleton-line" />
    <div className="skeleton-line medium" />
    <div className="skeleton-chart" />
  </div>
);

export default SummarySkeleton;
