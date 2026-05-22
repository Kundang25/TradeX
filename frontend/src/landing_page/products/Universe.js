import React from "react";
import { Link } from "react-router-dom";

function Universe() {
  return (
    <div className="container mt-5">
      <div className="row text-center">
        <h1>The Zerodha Universe</h1>
        <p>Extend your trading and investment experience even further with our partner platforms</p>
        
        <div className="col-4 p-3 mt-5">
          <img
            alt="smallcaseLogo"
            src="media/images/smallcaseLogo.png"/>
            <p className="text-small text-muted mt-3">Thematic investment</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img
            alt="streakLogo"
            src="media/images/streakLogo.png" style={{width:"35%"}}/>
            <p className="text-small text-muted mt-3">Algo & strategy platform</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img
            alt="sensibullLogo"
            src="media/images/sensibullLogo.svg" style={{width:"50%"}}/>
            <p className="text-small text-muted mt-3">Options trading platform</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img
            alt="zerodhaFundhouse"
            src="media/images/zerodhaFundhouse.png" style={{width:"60%"}}/>
            <p className="text-small text-muted mt-3">Asset management</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img
            alt="goldenpiLogo"
            src="media/images/goldenpiLogo.png" style={{width:"50%"}}/>
            <p className="text-small text-muted mt-3">Bonds trading platform</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img
            alt="dittoLogo"
            src="media/images/dittoLogo.png" style={{width:"30%"}}/>
            <p className="text-small text-muted mt-3">Insurance</p>
        </div>
        <Link
          to="/signup"
          className='p-2 btn btn-primary fs-5 mb-5 mt-5'
          style={{width:"20%", margin:"0 auto" , color:"white"}}
        >
          Sign up now
        </Link>

      </div>
    </div>
  );
}

export default Universe;
