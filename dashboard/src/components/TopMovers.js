import React from "react";
import { Link } from "react-router-dom";

const TopMovers = ({ movers }) => {
  if (!movers) return null;

  return (
    <div className="top-movers">
      <h4 className="section-subtitle">Top movers</h4>
      <div className="mover-row">
        {movers.topGainer && (
          <div className="mover-card gainer">
            <span className="mover-label">Top gainer</span>
            <Link to={`/ticker/${movers.topGainer.symbol}`}>
              {movers.topGainer.symbol}
            </Link>
            <span className="profit">{movers.topGainer.net}</span>
          </div>
        )}
        {movers.topLoser && (
          <div className="mover-card loser">
            <span className="mover-label">Top loser</span>
            <Link to={`/ticker/${movers.topLoser.symbol}`}>
              {movers.topLoser.symbol}
            </Link>
            <span className="loss">{movers.topLoser.net}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopMovers;
