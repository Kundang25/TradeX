import React, { useState, useContext, useEffect, useCallback } from "react";
import api from "../api/api";
import { getUser } from "../utils/auth";
import GeneralContext from "./GeneralContext";
import { useMarketStore } from "../store/useMarketStore";
import { toast } from "sonner";
import "./BuyActionWindow.css";

const QTY_PRESETS = [1, 5, 10, 25];

const BuyActionWindow = ({ uid, mode = "BUY", defaultPrice = 0 }) => {
  const { closeOrderWindow, notifyOrderPlaced } = useContext(GeneralContext);
  const market = useMarketStore((s) => s.market);
  const portfolio = useMarketStore((s) => s.portfolio);

  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(defaultPrice);
  const [orderType, setOrderType] = useState("MARKET");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isSell = mode === "SELL";
  const user = getUser();
  const liveStock = market.find((s) => s.symbol === uid);
  const livePrice = liveStock?.price ?? defaultPrice;
  const holding = portfolio?.holdings?.find((h) => h.symbol === uid);
  const availableCash = portfolio?.funds?.availableCash ?? 0;
  const maxSellQty = holding?.qty ?? 0;

  const effectivePrice =
    orderType === "MARKET" ? Number(livePrice) || Number(stockPrice) : Number(stockPrice);
  const estimatedTotal = effectivePrice * Number(stockQuantity);
  const marginRequired = estimatedTotal * 0.2;
  const canAfford = !isSell && availableCash >= estimatedTotal;
  const canSellQty = isSell && maxSellQty >= Number(stockQuantity);

  useEffect(() => {
    setStockPrice(defaultPrice || livePrice);
    setStockQuantity(1);
    setOrderType("MARKET");
    setError("");
  }, [uid, mode, defaultPrice, livePrice]);

  useEffect(() => {
    if (orderType === "MARKET" && livePrice) {
      setStockPrice(livePrice);
    }
  }, [orderType, livePrice]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeOrderWindow();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [closeOrderWindow]);

  const handleSubmit = async () => {
    const qty = Number(stockQuantity);
    const price = effectivePrice;

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
    if (isSell && qty > maxSellQty) {
      setError(`You only hold ${maxSellQty} shares of ${uid}`);
      return;
    }
    if (!isSell && estimatedTotal > availableCash) {
      setError(`Insufficient funds. Available: ₹${availableCash.toFixed(2)}`);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const { data } = await api.post("/newOrder", {
        symbol: uid,
        name: uid,
        qty,
        price,
        mode,
        orderType,
        userId: user.userId,
      });
      toast.success(`${mode} order executed for ${uid}`);
      notifyOrderPlaced(mode, uid, data.portfolio);
      closeOrderWindow();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to place order. Is the backend running?";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const adjustQty = useCallback((delta) => {
    setStockQuantity((q) => Math.max(1, Number(q) + delta));
  }, []);

  return (
    <>
      <div
        className="order-overlay"
        onClick={closeOrderWindow}
        aria-hidden="true"
      />
      <div className="container order-panel" id="buy-window" role="dialog" aria-modal="true">
        <div
          className={`order-window-header ${isSell ? "order-window-header-sell" : ""}`}
        >
          <div>
            <h3>
              {isSell ? "Sell" : "Buy"} {uid}
            </h3>
            {liveStock && (
              <p className="order-live-price">
                LTP ₹{Number(livePrice).toFixed(2)}{" "}
                <span className={liveStock.isDown ? "loss" : "profit"}>
                  {liveStock.percent}
                </span>
              </p>
            )}
          </div>
          <button
            type="button"
            className="order-close-btn"
            onClick={closeOrderWindow}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="regular-order">
          {error && <p className="order-error">{error}</p>}

          <div className="order-type-row">
            <label>
              <input
                type="radio"
                name="orderType"
                checked={orderType === "MARKET"}
                onChange={() => setOrderType("MARKET")}
              />
              Market
            </label>
            <label>
              <input
                type="radio"
                name="orderType"
                checked={orderType === "LIMIT"}
                onChange={() => setOrderType("LIMIT")}
              />
              Limit
            </label>
          </div>

          <div className="order-hints">
            {isSell ? (
              <span>Available to sell: <strong>{maxSellQty}</strong> qty</span>
            ) : (
              <span>
                Cash available: <strong>₹{availableCash.toFixed(2)}</strong>
              </span>
            )}
          </div>

          <div className="qty-presets">
            {QTY_PRESETS.map((n) => (
              <button
                key={n}
                type="button"
                className={`qty-preset ${Number(stockQuantity) === n ? "active" : ""}`}
                onClick={() => setStockQuantity(n)}
              >
                {n}
              </button>
            ))}
            {isSell && maxSellQty > 0 && (
              <button
                type="button"
                className="qty-preset"
                onClick={() => setStockQuantity(maxSellQty)}
              >
                Max
              </button>
            )}
          </div>

          <div className="inputs">
            <fieldset>
              <legend>Qty.</legend>
              <div className="qty-input-wrap">
                <button type="button" className="qty-step" onClick={() => adjustQty(-1)}>
                  −
                </button>
                <input
                  type="number"
                  name="qty"
                  min="1"
                  max={isSell ? maxSellQty : undefined}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  value={stockQuantity}
                />
                <button type="button" className="qty-step" onClick={() => adjustQty(1)}>
                  +
                </button>
              </div>
            </fieldset>
            <fieldset>
              <legend>Price</legend>
              <input
                type="number"
                name="price"
                step="0.05"
                min="0"
                onChange={(e) => setStockPrice(e.target.value)}
                value={stockPrice}
                disabled={orderType === "MARKET"}
              />
            </fieldset>
          </div>

          <p className="estimated-total">
            Estimated total: <strong>₹{estimatedTotal.toFixed(2)}</strong>
          </p>
          {!isSell && !canAfford && estimatedTotal > 0 && (
            <p className="order-warning">Not enough margin for this order</p>
          )}
          {isSell && !canSellQty && Number(stockQuantity) > 0 && (
            <p className="order-warning">Quantity exceeds your holdings</p>
          )}
        </div>

        <div className="buttons">
          <span>Margin required ₹{marginRequired.toFixed(2)}</span>
          <div>
            <button
              type="button"
              className={`btn ${isSell ? "btn-sell" : "btn-blue"}`}
              onClick={handleSubmit}
              disabled={
                submitting ||
                (!isSell && !canAfford && estimatedTotal > availableCash) ||
                (isSell && Number(stockQuantity) > maxSellQty)
              }
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
    </>
  );
};

export default BuyActionWindow;
