import React, { useState, useEffect } from "react";

import { getUser } from "../utils/auth";

const FUNDS_KEY = "tradestream_funds";

const defaultFunds = {
  availableCash: 4043.1,
  usedMargin: 3757.3,
  openingBalance: 4043.1,
  payin: 4064.0,
};

function loadFunds(userId) {
  try {
    const raw = localStorage.getItem(`${FUNDS_KEY}_${userId || "guest"}`);
    return raw ? { ...defaultFunds, ...JSON.parse(raw) } : { ...defaultFunds };
  } catch {
    return { ...defaultFunds };
  }
}

function saveFunds(userId, funds) {
  localStorage.setItem(`${FUNDS_KEY}_${userId || "guest"}`, JSON.stringify(funds));
}

const Funds = () => {
  const user = getUser();
  const [funds, setFunds] = useState(defaultFunds);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setFunds(loadFunds(user?.userId));
  }, [user?.userId]);

  const availableMargin = funds.availableCash;
  const persist = (next) => {
    setFunds(next);
    saveFunds(user?.userId, next);
  };

  const showMsg = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddFunds = () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      showMsg("Enter a valid amount to add", "error");
      return;
    }
    persist({
      ...funds,
      availableCash: funds.availableCash + value,
      payin: funds.payin + value,
    });
    setAmount("");
    showMsg(`₹${value.toFixed(2)} added to your account`);
  };

  const handleWithdraw = () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      showMsg("Enter a valid amount to withdraw", "error");
      return;
    }
    if (value > funds.availableCash) {
      showMsg("Insufficient balance", "error");
      return;
    }
    persist({
      ...funds,
      availableCash: funds.availableCash - value,
    });
    setAmount("");
    showMsg(`₹${value.toFixed(2)} withdrawn successfully`);
  };

  return (
    <>
      <h3 className="title">Funds</h3>

      {message && (
        <div className={`funds-message funds-message-${message.type}`}>
          {message.text}
        </div>
      )}

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
              <p>Available margin</p>
              <p className="imp colored">{availableMargin.toFixed(2)}</p>
            </div>
            <div className="data">
              <p>Used margin</p>
              <p className="imp">{funds.usedMargin.toFixed(2)}</p>
            </div>
            <div className="data">
              <p>Available cash</p>
              <p className="imp">{funds.availableCash.toFixed(2)}</p>
            </div>
            <hr />
            <div className="data">
              <p>Opening balance</p>
              <p>{funds.openingBalance.toFixed(2)}</p>
            </div>
            <div className="data">
              <p>Payin</p>
              <p>{funds.payin.toFixed(2)}</p>
            </div>
            <div className="data">
              <p>SPAN</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Delivery margin</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Exposure</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Options premium</p>
              <p>0.00</p>
            </div>
            <hr />
            <div className="data">
              <p>Collateral (Liquid funds)</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Collateral (Equity)</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Total collateral</p>
              <p>0.00</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="commodity">
            <p>You don&apos;t have a commodity account</p>
            <button type="button" className="btn btn-blue">
              Open account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Funds;
