import React from "react";

function Brokerage() {
  return (
    <div className="container">
      <div className="row p-5 mt-5 text-center border-top">
        <div className="col-6 p-4">
          <a style={{ textDecoration: "none" }} href="/pricing"> 
            <h3 className="fs-5"> Brokerage Calculator</h3> </a>
            <ul class="list-group">
              <li class="list-group-item">
                Call & Trade and RMS auto-squareoff: Additional charges of ₹50 +
                GST per order.
              </li>
              <li class="list-group-item">
                Digital contract notes will be sent via e-mail.
              </li>
              <li class="list-group-item">
                Physical copies of contract notes, if required, shall be charged
                ₹20 per contract note. Courier charges may apply.
              </li>
              <li class="list-group-item">
                For NRI account (non-PIS), 0.5% or ₹100 per executed order for
                equity (whichever is lower).
              </li>
              <li class="list-group-item">
                For NRI account (PIS), 0.5% or ₹200 per executed order for
                equity (whichever is lower).
              </li>
              <li class="list-group-item">
                If the account is in debit balance, any order placed will be
                charged ₹40 per executed order instead of ₹20 per executed
                order.
              </li>
            </ul>
          
        </div>
        <div className="col-6 p-4">
          <a style={{ textDecoration: "none" }} href="/pricing">
            <h3 className="fs-5"> List of charges</h3> </a>
            <ul class="list-group">
              <li class="list-group-item">
                <strong>Brokerage Charges:</strong> ₹0 for equity delivery; ₹20
                or 0.03% per executed order (whichever is lower) for intraday
                and F&O.
              </li>
              <li class="list-group-item">
                <strong>Securities Transaction Tax (STT):</strong> 0.1% on both
                buy and sell for delivery; 0.025% on sell for intraday.
              </li>
              <li class="list-group-item">
                <strong>Exchange Transaction Charges:</strong> Varies by
                segment; e.g., NSE equity delivery at ₹325 per crore.
              </li>
              <li class="list-group-item">
                <strong>GST:</strong> 18% on brokerage + transaction charges.
              </li>
              <li class="list-group-item">
                <strong>SEBI Charges:</strong> ₹10 per crore of turnover.
              </li>
              <li class="list-group-item">
                <strong>Stamp Duty:</strong> As per the state government; e.g.,
                0.015% for delivery on buy side.
              </li>
              <li class="list-group-item">
                <strong>Call & Trade Charges:</strong> ₹50 + GST per order (if
                applicable).
              </li>
              <li class="list-group-item">
                <strong>RMS Auto Square-off:</strong> ₹50 + GST per executed
                order if position is squared off by RMS.
              </li>
            </ul>
          
        </div>
      </div>
    </div>
  );
}

export default Brokerage;
