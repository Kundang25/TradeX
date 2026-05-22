import React from "react";

const apps = [
  {
    name: "Smallcase",
    description: "Thematic stock & ETF portfolios",
    category: "Investments",
    url: "https://smallcase.com",
  },
  {
    name: "Streak",
    description: "Algo & strategy platform for backtesting",
    category: "Trading",
    url: "https://www.streak.tech",
  },
  {
    name: "Sensibull",
    description: "Options trading & strategy builder",
    category: "Options",
    url: "https://sensibull.com",
  },
  {
    name: "Zerodha Fund House",
    description: "Direct mutual funds & asset management",
    category: "Mutual funds",
    url: "https://www.zerodhafundhouse.com",
  },
  {
    name: "GoldenPi",
    description: "Bonds & fixed-income marketplace",
    category: "Bonds",
    url: "https://www.goldenpi.com",
  },
  {
    name: "Ditto",
    description: "Insurance advisory & policies",
    category: "Insurance",
    url: "https://joinditto.in",
  },
];

const Apps = () => {
  const openApp = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <h3 className="title">Apps</h3>
      <p className="apps-subtitle">
        Extend your trading experience with partner platforms
      </p>

      <div className="apps-grid">
        {apps.map((app) => (
          <div className="app-card" key={app.name}>
            <div className="app-card-header">
              <span className="app-icon">{app.name.charAt(0)}</span>
              <div>
                <h4>{app.name}</h4>
                <span className="app-category">{app.category}</span>
              </div>
            </div>
            <p className="app-description">{app.description}</p>
            <button
              type="button"
              className="btn btn-blue app-open-btn"
              onClick={() => openApp(app.url)}
            >
              Open app
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Apps;
