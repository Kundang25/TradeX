import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const label = ctx.label || "";
          const value = ctx.parsed || 0;
          return `${label}: ${value.toFixed(1)}%`;
        },
      },
    },
  },
  animation: {
    animateRotate: true,
    duration: 800,
  },
};

export function DoughnutChart({ data, options }) {
  return <Doughnut data={data} options={{ ...defaultOptions, ...options }} />;
}
