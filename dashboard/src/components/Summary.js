import React from "react";
import { useMarketStore } from "../store/useMarketStore";
import { getUser } from "../utils/auth";
import { formatINR } from "../utils/portfolio";
import PortfolioCards from "./PortfolioCards";
import SectorChart from "./SectorChart";
import AllocationChart from "./AllocationChart";
import TopMovers from "./TopMovers";
import InsightsPanel from "./InsightsPanel";
import PnlHeatmap from "./PnlHeatmap";
import SummarySkeleton from "./SummarySkeleton";

const Summary = () => {
  const user = getUser();
  const { portfolio, loading } = useMarketStore();
  const analytics = portfolio?.analytics;
  const funds = portfolio?.funds;
  const holdings = portfolio?.holdings || [];

  if (loading && !portfolio) {
    return <SummarySkeleton />;
  }

  return (
    <>
      <div className="username">
        <h6>Hi, {user?.name || "Trader"}!</h6>
        <hr className="divider" />
      </div>

      <PortfolioCards analytics={analytics} />

      <div className="section">
        <span>
          <p>Equity</p>
        </span>
        <div className="data">
          <div className="first">
            <h3>{formatINR(funds?.availableCash || 0)}</h3>
            <p>Margin available</p>
          </div>
          <hr />
          <div className="second">
            <p>
              Holdings <span>{analytics?.holdingsCount || 0}</span>
            </p>
            <p>
              Used margin <span>{formatINR(funds?.usedMargin || 0)}</span>
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      {analytics && (
        <div className="section">
          <span>
            <p>Holdings ({analytics.holdingsCount})</p>
          </span>
          <div className="data">
            <div className="first">
              <h3 className={analytics.totalPnl >= 0 ? "profit" : "loss"}>
                {formatINR(analytics.totalPnl)}{" "}
                <small>({analytics.totalPnlPercent.toFixed(2)}%)</small>
              </h3>
              <p>P&L</p>
            </div>
            <hr />
            <div className="second">
              <p>
                Current value <span>{formatINR(analytics.totalCurrentValue)}</span>
              </p>
              <p>
                Investment <span>{formatINR(analytics.totalInvestment)}</span>
              </p>
            </div>
          </div>
          <hr className="divider" />
        </div>
      )}

      <TopMovers movers={portfolio?.movers} />
      <InsightsPanel analytics={analytics} />

      <div className="charts-row">
        <AllocationChart allocation={analytics?.allocation} />
        <SectorChart
          sectorBreakdown={analytics?.sectorBreakdown}
          title="Sector analytics"
        />
      </div>

      <PnlHeatmap holdings={holdings} />
    </>
  );
};

export default Summary;
