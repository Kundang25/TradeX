import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { getUser } from "../utils/auth";
import GeneralContext from "./GeneralContext";

const Orders = () => {
  const { ordersRefreshKey } = useContext(GeneralContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState("ALL");
  const user = getUser();

  useEffect(() => {
    if (!user?.userId) return;

    setLoading(true);
    const params = { userId: user.userId };
    if (filterMode !== "ALL") params.mode = filterMode;

    api
      .get("/allOrders", { params })
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [ordersRefreshKey, user?.userId, filterMode]);

  if (loading) {
    return (
      <div className="orders">
        <p className="orders-status">Loading orders…</p>
      </div>
    );
  }

  return (
    <>
      <div className="orders-header">
        <h3 className="title">Orders ({orders.length})</h3>
        <div className="order-filters">
          {["ALL", "BUY", "SELL"].map((f) => (
            <button
              key={f}
              type="button"
              className={`filter-btn ${filterMode === f ? "active" : ""}`}
              onClick={() => setFilterMode(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="orders">
          <div className="no-orders">
            <p>No orders yet</p>
            <p className="orders-hint">
              Hover a stock in the watchlist and click Buy or Sell
            </p>
            <Link to="/" className="btn">
              Go to watchlist
            </Link>
          </div>
        </div>
      ) : (
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>Instrument</th>
                <th>Type</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Qty.</th>
                <th>Price</th>
                <th>Total</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id || index}>
                  <td>{order.name}</td>
                  <td>{order.orderType || "MARKET"}</td>
                  <td>
                    <span
                      className={
                        order.mode === "SELL" ? "order-badge sell" : "order-badge buy"
                      }
                    >
                      {order.mode}
                    </span>
                  </td>
                  <td>
                    <span className="order-badge status">{order.status || "COMPLETED"}</span>
                  </td>
                  <td>{order.qty}</td>
                  <td>₹{Number(order.price).toFixed(2)}</td>
                  <td>₹{(Number(order.qty) * Number(order.price)).toFixed(2)}</td>
                  <td>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Orders;
