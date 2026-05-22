function formatPct(value) {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function enrichHolding(raw, livePrice) {
  const symbol = raw.symbol || raw.name;
  const qty = Number(raw.qty) || 0;
  const avgPrice = Number(raw.avgPrice ?? raw.avg) || 0;
  const currentPrice = Number(livePrice ?? raw.currentPrice ?? raw.price) || avgPrice;
  const investment = qty * avgPrice;
  const currentValue = qty * currentPrice;
  const pnl = currentValue - investment;
  const pnlPercent = avgPrice ? ((currentPrice - avgPrice) / avgPrice) * 100 : 0;
  const prev = Number(raw.previousClose) || avgPrice;
  const dayChangePercent = prev ? ((currentPrice - prev) / prev) * 100 : 0;

  return {
    _id: raw._id,
    userId: raw.userId,
    symbol,
    qty,
    avgPrice,
    currentPrice,
    sector: raw.sector || "Other",
    investment,
    currentValue,
    pnl,
    pnlPercent,
    net: formatPct(pnlPercent),
    day: formatPct(dayChangePercent),
    isLoss: pnl < 0,
    isDayLoss: dayChangePercent < 0,
  };
}

function computeAnalytics(holdings) {
  if (!holdings.length) {
    return {
      totalInvestment: 0,
      totalCurrentValue: 0,
      totalPnl: 0,
      totalPnlPercent: 0,
      holdingsCount: 0,
      bestStock: null,
      worstStock: null,
      diversificationScore: 0,
      riskLevel: "Low",
      sectorBreakdown: [],
      allocation: [],
      insights: ["Start trading to build your portfolio."],
    };
  }

  const totalInvestment = holdings.reduce((s, h) => s + h.investment, 0);
  const totalCurrentValue = holdings.reduce((s, h) => s + h.currentValue, 0);
  const totalPnl = totalCurrentValue - totalInvestment;
  const totalPnlPercent = totalInvestment
    ? (totalPnl / totalInvestment) * 100
    : 0;

  const sorted = [...holdings].sort((a, b) => b.pnlPercent - a.pnlPercent);
  const bestStock = sorted[0];
  const worstStock = sorted[sorted.length - 1];

  const sectorTotals = {};
  holdings.forEach((h) => {
    sectorTotals[h.sector] = (sectorTotals[h.sector] || 0) + h.currentValue;
  });

  const sectorBreakdown = Object.entries(sectorTotals)
    .map(([sector, value]) => ({
      sector,
      value,
      percent: totalCurrentValue ? (value / totalCurrentValue) * 100 : 0,
    }))
    .sort((a, b) => b.percent - a.percent);

  const allocation = holdings.map((h) => ({
    symbol: h.symbol,
    value: h.currentValue,
    percent: totalCurrentValue ? (h.currentValue / totalCurrentValue) * 100 : 0,
    sector: h.sector,
  }));

  const topSector = sectorBreakdown[0];
  const diversificationScore = Math.min(
    100,
    Math.round(sectorBreakdown.length * 18 + holdings.length * 4)
  );

  let riskLevel = "Low";
  if (topSector?.percent > 50) riskLevel = "High";
  else if (topSector?.percent > 35) riskLevel = "Medium";

  const insights = [];
  if (topSector) {
    insights.push(
      `Your ${topSector.sector} exposure is ${topSector.percent.toFixed(1)}% of portfolio.`
    );
  }
  if (bestStock) {
    insights.push(
      `${bestStock.symbol} is your best performer at ${bestStock.net} overall.`
    );
  }
  if (worstStock && worstStock.pnl < 0) {
    insights.push(
      `${worstStock.symbol} is down ${Math.abs(worstStock.pnlPercent).toFixed(2)}% — consider rebalancing.`
    );
  }
  if (totalPnl >= 0) {
    insights.push(`Portfolio P&L is positive at ₹${totalPnl.toFixed(2)}.`);
  } else {
    insights.push(`Portfolio P&L is ₹${totalPnl.toFixed(2)} — review losing positions.`);
  }

  return {
    totalInvestment,
    totalCurrentValue,
    totalPnl,
    totalPnlPercent,
    holdingsCount: holdings.length,
    bestStock,
    worstStock,
    diversificationScore,
    riskLevel,
    sectorBreakdown,
    allocation,
    insights,
  };
}

function getTopMovers(holdings) {
  const sorted = [...holdings].sort(
    (a, b) => b.pnlPercent - a.pnlPercent
  );
  return {
    topGainer: sorted[0] || null,
    topLoser: sorted[sorted.length - 1] || null,
  };
}

module.exports = {
  enrichHolding,
  computeAnalytics,
  getTopMovers,
  formatPct,
};
