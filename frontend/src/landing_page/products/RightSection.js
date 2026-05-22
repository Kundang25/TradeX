import React from "react";

function RightSection({ imageURL, productName, productDescription, learnMore }) {
  return (
    <div className="container">
      <div className="row p-5 align-items-center"> {/* FLEX CENTER */}
        
        <div className="col-1"></div>
        <div className="col-4 p-5">
          <h1>{productName}</h1>
          <p>{productDescription}</p>
          <div>
            <a href={learnMore} style={{ textDecoration: "none" }}>
              Learn More <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
            </a>
          </div>
        </div>
        <div className="col-7 d-flex justify-content-center">
          <img src={imageURL} alt={productName} style={{ maxWidth: "100%" }} />
        </div>
      
      </div>
    </div>
  );
}

export default RightSection;
