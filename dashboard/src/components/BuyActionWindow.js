import React, { useState, useContext, useEffect } from "react";

import api from "../api/api";
import { getUser } from "../utils/auth";
import GeneralContext from "./GeneralContext";

import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid, mode = "BUY", defaultPrice = 0 }) => {
  const { closeOrderWindow, notifyOrderPlaced } = useContext(GeneralContext);
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(defaultPrice);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isSell = mode === "SELL";
  const user = getUser();

  useEffect(() => {
    setStockPrice(defaultPrice);
    setStockQuantity(1);
    setError("");
  }, [uid, mode, defaultPrice]);

  const handleSubmit = async () => {
    const qty = Number(stockQuantity);
    const price = Number(stockPrice);

    if (!qty || qty <= 0) {
      setError("Enter a valid quantity");
      return;
    }
    if (!price || price <= 0) {
      setError("Enter a valid price");
      return;
    }

    if (!user?.userId) {
      setError("You must be signed in to place orders.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await api.post("/newOrder", {
        name: uid,
        qty,
        price,
        mode,
        userId: user.userId,
      });
      notifyOrderPlaced(mode, uid);
      closeOrderWindow();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to place order. Is the backend running?"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div
        className={`order-window-header ${isSell ? "order-window-header-sell" : ""}`}
      >
        <h3>
          {isSell ? "Sell" : "Buy"} {uid}
        </h3>
        <span className="order-mode-tag">{mode}</span>
      </div>

      <div className="regular-order">
        {error && <p className="order-error">{error}</p>}
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              min="0"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹{(Number(stockPrice) * Number(stockQuantity) * 0.2).toFixed(2)}</span>
        <div>
          <button
            type="button"
            className={`btn ${isSell ? "btn-sell" : "btn-blue"}`}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Placing…" : isSell ? "Sell" : "Buy"}
          </button>
          <button
            type="button"
            className="btn btn-grey"
            onClick={closeOrderWindow}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
