import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../api/api";
import { getUser } from "../utils/auth";
import { formatINR } from "../utils/portfolio";
import { useMarketStore } from "../store/useMarketStore";

const Funds = () => {
  const user = getUser();
  const { portfolio, fetchPortfolio } = useMarketStore();
  const [amount, setAmount] = useState("");
  const funds = portfolio?.funds || { availableCash: 0, usedMargin: 0 };

  useEffect(() => {
    if (user?.userId) fetchPortfolio(user.userId);
  }, [user?.userId, fetchPortfolio]);

  const handleAddFunds = async () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    try {
      await api.patch("/api/funds", {
        userId: user.userId,
        availableCash: funds.availableCash + value,
      });
      toast.success(`₹${value} added`);
      setAmount("");
      fetchPortfolio(user.userId);
    } catch {
      toast.error("Failed to add funds");
    }
  };

  const handleWithdraw = async () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (value > funds.availableCash) {
      toast.error("Insufficient balance");
      return;
    }
    try {
      await api.patch("/api/funds", {
        userId: user.userId,
        availableCash: funds.availableCash - value,
      });
      toast.success(`₹${value} withdrawn`);
      setAmount("");
      fetchPortfolio(user.userId);
    } catch {
      toast.error("Failed to withdraw");
    }
  };

  return (
    <>
      <h3 className="title">Funds</h3>

      <div className="funds">
        <p>Instant, zero-cost fund transfers with UPI</p>
        <div className="funds-actions">
          <input
            type="number"
            className="funds-input"
            placeholder="Amount (₹)"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button type="button" className="btn btn-green" onClick={handleAddFunds}>
            Add funds
          </button>
          <button type="button" className="btn btn-blue" onClick={handleWithdraw}>
            Withdraw
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <span>
            <p>Equity</p>
          </span>
          <div className="table">
            <div className="data">
              <p>Available cash</p>
              <p className="imp colored">{formatINR(funds.availableCash)}</p>
            </div>
            <div className="data">
              <p>Used margin</p>
              <p className="imp">{formatINR(funds.usedMargin)}</p>
            </div>
            <div className="data">
              <p>Portfolio value</p>
              <p className="imp">
                {formatINR(portfolio?.analytics?.totalCurrentValue || 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="commodity">
            <p>Paper trading wallet — funds update when you buy or sell.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Funds;
