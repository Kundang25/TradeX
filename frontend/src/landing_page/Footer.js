import React from "react";

function Footer() {
  return (
    <footer style={{backgroundColor: "rgb(240, 240, 240)"}}>
    <div className="container border-top mt-5" >
      <div className="row mt-5">
        <div className="col-3">
          <img
            src="media/images/logo.svg"
            alt="footer"
            style={{ width: "48%" }}
            className="mb-3"
          />
          <p>
            {" "}
            &copy; 2010 - 2024, Not Zerodha Broking Ltd.
            <br />
            All rights reserved
          </p>
          <i class="fa fa-twitter-square fa-lg mx-2" aria-hidden="true"></i>
          <i class="fa fa-instagram fa-lg  mx-2" aria-hidden="true"></i>
          <i class="fa fa-facebook-official fa-lg  mx-2" aria-hidden="true"></i>
          <i class="fa fa-linkedin fa-lg  mx-2" aria-hidden="true"></i>
          <i class="fa fa-telegram fa-lg  mx-2" aria-hidden="true"></i>
        </div>
        <div className="col-3">
          <h3 className="fs-5 mb-3">Company</h3>
          <a className="text-decoration-none " href="">About</a> <br />
          <a  className="text-decoration-none" href="">Products</a> <br />
          <a className="text-decoration-none" href="">Pricing</a> <br />
          <a className="text-decoration-none" href="">Referral</a> <br />
          <a className="text-decoration-none" href="">Careers</a> <br />
          <a className="text-decoration-none" href="">Zerodha.tech</a> <br />
          <a className="text-decoration-none" href="">Press & media</a> <br />
          <a className="text-decoration-none" href="">Zerodha cares (CSR)</a> <br />
        </div>
        <div className="col-3">
          <h3 className="fs-5">Support</h3>
          <a className="text-decoration-none" href="">Contact</a> <br />
          <a className="text-decoration-none" href="">Support portal</a> <br />
          <a className="text-decoration-none" href="">Z-Connect blog</a> <br />
          <a className="text-decoration-none" href="">List of charges</a> <br />
          <a className="text-decoration-none" href="">Downloads & resources</a> <br />
        </div>
        <div className="col-3">
          <h3 className="fs-5">Account</h3>
          <a className="text-decoration-none" href="">Open an account</a> <br />
          <a className="text-decoration-none" href="">Fund transfer</a> <br />
          <a className="text-decoration-none" href="">60 day challenge</a> <br />
        </div>
      </div>
      <div className="mt-5  text-muted" style={{fontSize: "14px"}}>
      <p>
        Zerodha Broking Ltd.: Member of NSE, BSE​ &​ MCX – SEBI Registration
        no.: INZ000031633 CDSL/NSDL: Depository services through Zerodha Broking
        Ltd. – SEBI Registration no.: IN-DP-431-2019 Commodity Trading through
        Zerodha Commodities Pvt. Ltd. MCX: 46025; NSE-50001 – SEBI Registration
        no.: INZ000038238 Registered Address: Zerodha Broking Ltd., #153/154,
        4th Cross, Dollars Colony, Opp. Clarence Public School, J.P Nagar 4th
        Phase, Bengaluru - 560078, Karnataka, India. For any complaints
        pertaining to securities broking please write to complaints@zerodha.com,
        for DP related to dp@zerodha.com. Please ensure you carefully read the
        Risk Disclosure Document as prescribed by SEBI | ICF
      </p>
      <p>
        Procedure to file a complaint on SEBI SCORES: Register on SCORES portal.
        Mandatory details for filing complaints on SCORES: Name, PAN, Address,
        Mobile Number, E-mail ID. Benefits: Effective Communication, Speedy
        redressal of the grievances{" "}
      </p>
      <p>Smart Online Dispute Resolution | Grievances Redressal Mechanism</p>{" "}
      <p>
        Investments in securities market are subject to market risks; read all
        the related documents carefully before investing.
      </p>
      <p>
        Attention investors: 1) Stock brokers can accept securities as margins
        from clients only by way of pledge in the depository system w.e.f
        September 01, 2020. 2) Update your e-mail and phone number with your
        stock broker / depository participant and receive OTP directly from
        depository on your e-mail and/or mobile number to create pledge. 3)
        Check your securities / MF / bonds in the consolidated account statement
        issued by NSDL/CDSL every month.
      </p>
      <p>
        "Prevent unauthorised transactions in your account. Update your mobile
        numbers/email IDs with your stock brokers. Receive information of your
        transactions directly from Exchange on your mobile/email at the end of
        the day. Issued in the interest of investors. KYC is one time exercise
        while dealing in securities markets - once KYC is done through a SEBI
        registered intermediary (broker, DP, Mutual Fund etc.), you need not
        undergo the same process again when you approach another intermediary."
        Dear Investor, if you are subscribing to an IPO, there is no need to
        issue a cheque. Please write the Bank account number and sign the IPO
        application form to authorize your bank to make payment in case of
        allotment. In case of non allotment the funds will remain in your bank
        account. As a business we don't give stock tips, and have not authorized
        anyone to trade on behalf of others. If you find anyone claiming to be
        part of Zerodha and offering such services, please create a ticket here.{" "}
      </p>
      </div>
      <div className="mt-4 mx-4 text-center p-4">
            <a className="mx-4 text-decoration-none" href="">NSE</a>
            <a className="mx-4 text-decoration-none" href="">BSE</a>
            <a className="mx-4 text-decoration-none" href="">MCX</a>
            <a className="mx-4 text-decoration-none" href="">Terms & conditions</a>
            <a className="mx-4 text-decoration-none" href="">Policies & procedures</a>
            <a className="mx-4 text-decoration-none" href="">Privacy policy</a>
            <a className="mx-4 text-decoration-none" href="">Disclosure</a>
    </div>

      
    </div>
    </footer>
  );
}

export default Footer;
