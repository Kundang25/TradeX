import React, { useEffect, useState } from "react";

import Menu from "./Menu";

const TopBar = ({ user }) => {
  const [dark, setDark] = useState(
    () => localStorage.getItem("tradestream_theme") === "dark"
  );

  useEffect(() => {
    document.body.classList.toggle("dark-mode", dark);
    localStorage.setItem("tradestream_theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="topbar-container">
      <div className="indices-container">
        <div className="nifty">
          <p className="index">NIFTY 50</p>
          <p className="index-points live-pulse">24,850</p>
        </div>
        <div className="sensex">
          <p className="index">SENSEX</p>
          <p className="index-points live-pulse">81,420</p>
        </div>
      </div>

      <button
        type="button"
        className="theme-toggle"
        onClick={() => setDark((d) => !d)}
        title="Toggle dark mode"
      >
        {dark ? "☀️" : "🌙"}
      </button>

      {user?.userId && (
        <div className="user-id-badge" title={user.email || user.name}>
          User ID: <span>{user.userId}</span>
        </div>
      )}

      <Menu user={user} />
    </div>
  );
};

export default TopBar;
