import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import api from "../api/api";
import { getUser } from "../utils/auth";
import GeneralContext from "./GeneralContext";

const Orders = () => {
  const { ordersRefreshKey } = useContext(GeneralContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    if (!user?.userId) return;

    setLoading(true);
    api
      .get("/allOrders", { params: { userId: user.userId } })
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [ordersRefreshKey, user?.userId]);

  if (loading) {
    return (
      <div className="orders">
        <p className="orders-status">Loading orders…</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders">
        <div className="no-orders">
          <p>You haven&apos;t placed any orders today</p>
          <p className="orders-hint">
            Hover a stock in the watchlist and click Buy or Sell
          </p>
          <Link to="/" className="btn">
            Go to watchlist
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <h3 className="title">Orders ({orders.length})</h3>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Mode</th>
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
                <td>
                  <span
                    className={
                      order.mode === "SELL" ? "order-badge sell" : "order-badge buy"
                    }
                  >
                    {order.mode}
                  </span>
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
    </>
  );
};

export default Orders;
