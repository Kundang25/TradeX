import React, { useState, useEffect } from "react";

import api from "../api/api";
import { positions as fallbackPositions } from "../data/data";

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    api
      .get("/allPositions")
      .then((res) => {
        setPositions(res.data);
        setLoadError("");
      })
      .catch(() => {
        setPositions(fallbackPositions);
        setLoadError(
          "Could not reach the API — showing cached positions. Start the backend on port 3002."
        );
      });
  }, []);

  return (
    <>
      {loadError && (
        <div className="api-warning" role="alert">
          {loadError}
        </div>
      )}
      <h3 className="title">Positions ({positions.length})</h3>

      <div className="order-table">
        <table>
          <tr>
            <th>Product</th>
            <th>Instrument</th>
            <th>Qty.</th>
            <th>Avg.</th>
            <th>LTP</th>
            <th>P&L</th>
            <th>Chg.</th>
          </tr>

          {positions.map((stock, index) => {
            const curValue = stock.price * stock.qty;
            const isProfit = curValue - stock.avg * stock.qty >= 0.0;
            const profClass = isProfit ? "profit" : "loss";
            const dayClass = stock.isLoss ? "loss" : "profit";

            return (
              <tr key={index}>
                <td>{stock.product}</td>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{stock.avg.toFixed(2)}</td>
                <td>{stock.price.toFixed(2)}</td>
                <td className={profClass}>
                  {(curValue - stock.avg * stock.qty).toFixed(2)}
                </td>
                <td className={dayClass}>{stock.day}</td>
              </tr>
            );
          })}
        </table>
      </div>
    </>
  );
};

export default Positions;
