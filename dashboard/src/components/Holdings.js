import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { getUser } from "../utils/auth";
import { formatINR } from "../utils/portfolio";
import { useMarketStore } from "../store/useMarketStore";
import PortfolioCards from "./PortfolioCards";
import { VerticalGraph } from "./VerticalGraph";
import { CHART_COLORS } from "../utils/portfolio";

const Holdings = () => {
  const user = getUser();
  const { portfolio } = useMarketStore();
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.userId) return;
    api
      .get("/allHoldings", { params: { userId: user.userId } })
      .then((res) => setHoldings(res.data))
      .catch(() => setHoldings(portfolio?.holdings || []))
      .finally(() => setLoading(false));
  }, [user?.userId, portfolio?.holdings]);

  const analytics = portfolio?.analytics;

  const labels = holdings.map((h) => h.symbol);
  const data = {
    labels,
    datasets: [
      {
        label: "Current value",
        data: holdings.map((h) => h.currentValue),
        backgroundColor: CHART_COLORS.slice(0, holdings.length),
      },
    ],
  };

  if (loading && holdings.length === 0) {
    return <p className="orders-status">Loading holdings…</p>;
  }

  return (
    <>
      <PortfolioCards analytics={analytics} />
      <h3 className="title">Holdings ({holdings.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Sector</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((stock) => {
              const profClass = stock.pnl >= 0 ? "profit" : "loss";
              return (
                <tr key={stock.symbol}>
                  <td>
                    <Link to={`/ticker/${stock.symbol}`}>{stock.symbol}</Link>
                  </td>
                  <td>{stock.sector}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avgPrice.toFixed(2)}</td>
                  <td>{stock.currentPrice.toFixed(2)}</td>
                  <td>{stock.currentValue.toFixed(2)}</td>
                  <td className={profClass}>{stock.pnl.toFixed(2)}</td>
                  <td className={profClass}>{stock.net}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {analytics && (
        <div className="row holdings-totals">
          <div className="col">
            <h5>{formatINR(analytics.totalInvestment)}</h5>
            <p>Total investment</p>
          </div>
          <div className="col">
            <h5>{formatINR(analytics.totalCurrentValue)}</h5>
            <p>Current value</p>
          </div>
          <div className="col">
            <h5 className={analytics.totalPnl >= 0 ? "profit" : "loss"}>
              {formatINR(analytics.totalPnl)} ({analytics.totalPnlPercent.toFixed(2)}%)
            </h5>
            <p>P&L</p>
          </div>
        </div>
      )}
      {holdings.length > 0 && <VerticalGraph data={data} />}
    </>
  );
};

export default Holdings;
