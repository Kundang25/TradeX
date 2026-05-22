import React from "react";
import { DoughnutChart } from "./DoughnoutChart";
import { CHART_COLORS } from "../utils/portfolio";

const AllocationChart = ({ allocation }) => {
  if (!allocation?.length) return null;

  const top = allocation.slice(0, 8);
  const labels = top.map((a) => `${a.symbol} (${a.percent.toFixed(1)}%)`);

  const data = {
    labels,
    datasets: [
      {
        label: "Portfolio allocation",
        data: top.map((a) => a.percent),
        backgroundColor: CHART_COLORS.slice(0, top.length),
        borderWidth: 1,
        hoverOffset: 8,
      },
    ],
  };

  return (
    <div className="chart-panel">
      <h4 className="chart-title">Portfolio allocation</h4>
      <DoughnutChart data={data} />
      <ul className="chart-legend">
        {top.map((a, i) => (
          <li key={a.symbol}>
            <span
              className="legend-dot"
              style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
            />
            {a.symbol} — {a.percent.toFixed(1)}% · {a.sector}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllocationChart;
