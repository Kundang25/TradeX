import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { getUser } from "../utils/auth";
import GeneralContext from "./GeneralContext";
import { Tooltip, Grow } from "@mui/material";
import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
  Close,
} from "@mui/icons-material";
import AllocationChart from "./AllocationChart";
import { useMarketStore } from "../store/useMarketStore";

const WatchList = () => {
  const user = getUser();
  const { portfolio } = useMarketStore();
  const [watchlist, setWatchlist] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const loadWatchlist = useCallback(() => {
    if (!user?.userId) return;
    api
      .get("/api/watchlist", { params: { userId: user.userId } })
      .then((res) => setWatchlist(res.data))
      .catch(() => setWatchlist([]));
  }, [user?.userId]);

  useEffect(() => {
    loadWatchlist();
  }, [loadWatchlist, portfolio]);

  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }
    api
      .get("/api/market/search", { params: { q: search } })
      .then((res) => setSuggestions(res.data.slice(0, 6)))
      .catch(() => setSuggestions([]));
  }, [search]);

  const filtered = watchlist.filter((s) =>
    s.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const addSymbol = async (symbol) => {
    await api.post("/api/watchlist", { userId: user.userId, symbol });
    setSearch("");
    loadWatchlist();
  };

  const removeSymbol = async (symbol) => {
    await api.delete(`/api/watchlist/${symbol}`, {
      params: { userId: user.userId },
    });
    loadWatchlist();
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search eg: INFY, TCS, RELIANCE"
          className="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="counts">
          {filtered.length} / 50
        </span>
        {suggestions.length > 0 && (
          <ul className="search-suggestions">
            {suggestions.map((s) => (
              <li key={s.symbol}>
                <button type="button" onClick={() => addSymbol(s.symbol)}>
                  + {s.symbol} · {s.sector}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ul className="list">
        {filtered.length === 0 ? (
          <li className="watchlist-empty">
            {search ? "No matches" : "Add stocks via search above"}
          </li>
        ) : (
          filtered.map((stock) => (
            <WatchListItem
              stock={stock}
              key={stock.symbol}
              onRemove={() => removeSymbol(stock.symbol)}
            />
          ))
        )}
      </ul>

      {portfolio?.analytics?.allocation?.length > 0 && (
        <div className="watchlist-chart">
          <AllocationChart allocation={portfolio.analytics.allocation} />
        </div>
      )}
    </div>
  );
};

export default WatchList;

const WatchListItem = ({ stock, onRemove }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);
  const priceDisplay =
    typeof stock.price === "number" ? stock.price.toFixed(2) : stock.price ?? "—";

  return (
    <li
      className={showWatchlistActions ? "watchlist-item-active" : ""}
      onMouseEnter={() => setShowWatchlistActions(true)}
      onMouseLeave={() => setShowWatchlistActions(false)}
    >
      <div className="item">
        <Link to={`/ticker/${stock.symbol}`} className="symbol-link">
          <p className={stock.isDown ? "down" : "up"}>{stock.symbol}</p>
        </Link>
        <div className="itemInfo">
          <span className="percent">{stock.percent}</span>
          {stock.isDown ? (
            <KeyboardArrowDown className="down" />
          ) : (
            <KeyboardArrowUp className="up" />
          )}
          <span className="price">{priceDisplay}</span>
        </div>
        <button type="button" className="watchlist-remove" onClick={onRemove}>
          <Close fontSize="small" />
        </button>
      </div>
      <WatchListActions stock={stock} visible={showWatchlistActions} />
    </li>
  );
};

const WatchListActions = ({ stock, visible }) => {
  const { openBuyWindow, openSellWindow } = useContext(GeneralContext);

  return (
    <span className={`actions ${visible ? "actions-visible" : ""}`}>
      <span>
        <Tooltip title="Buy (B)" placement="top" arrow TransitionComponent={Grow}>
          <button
            className="buy"
            onClick={() => openBuyWindow(stock.symbol, stock.price)}
          >
            Buy
          </button>
        </Tooltip>
        <Tooltip title="Sell (S)" placement="top" arrow TransitionComponent={Grow}>
          <button
            className="sell"
            onClick={() => openSellWindow(stock.symbol, stock.price)}
          >
            Sell
          </button>
        </Tooltip>
        <Tooltip title="Chart" placement="top" arrow TransitionComponent={Grow}>
          <Link to={`/ticker/${stock.symbol}`} className="action">
            <BarChartOutlined className="icon" />
          </Link>
        </Tooltip>
        <Tooltip title="More" placement="top" arrow TransitionComponent={Grow}>
          <button className="action">
            <MoreHoriz className="icon" />
          </button>
        </Tooltip>
      </span>
    </span>
  );
};
