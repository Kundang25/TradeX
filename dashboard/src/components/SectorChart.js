import React from "react";
import { DoughnutChart } from "./DoughnoutChart";
import { CHART_COLORS } from "../utils/portfolio";

const SectorChart = ({ sectorBreakdown, title }) => {
  if (!sectorBreakdown?.length) return null;

  const labels = sectorBreakdown.map((s) => `${s.sector} (${s.percent.toFixed(1)}%)`);
  const data = {
    labels,
    datasets: [
      {
        label: title || "Sector allocation",
        data: sectorBreakdown.map((s) => s.percent),
        backgroundColor: CHART_COLORS.slice(0, sectorBreakdown.length),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="chart-panel">
      <h4 className="chart-title">{title || "Sector distribution"}</h4>
      <DoughnutChart data={data} />
      <ul className="chart-legend">
        {sectorBreakdown.map((s, i) => (
          <li key={s.sector}>
            <span
              className="legend-dot"
              style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
            />
            {s.sector} — {s.percent.toFixed(1)}%
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SectorChart;
