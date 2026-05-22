import React from "react";

function LeftSection({
  imageURL,
  productName,
  productDescription,
  tryDemo,
  learnMore,
  googlePlay,
  appStore,
  
}) {
  return (
  <div className="container">
    <div className="row p-5">
        <div className="col-7 p-5 mb-5">
            <img src={imageURL} alt={productName} style={{ maxWidth: "100%" }} />
        </div>
        <div className="col-5 p-5 mt-5">
            <h1>{productName}</h1>
            <p className="mt-4">{productDescription}</p>
            <div className="mt-4">
                <a href={tryDemo} style={{textDecoration:"none"}}>Try Demo <i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
                <a href={learnMore} style={{textDecoration:"none", marginLeft:"50px"}}>Learn More <i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
            </div>
            <div className="mt-4">
                <a href={googlePlay}> <img src="/media/images/googlePlayBadge.svg" alt="Google Play" /> </a>
                <a href={appStore}> <img src="/media/images/appStoreBadge.svg" alt="App Store" /> </a>
            </div>
            
            
            
        </div>
    </div>
  </div>)
  ;
}

export default LeftSection;
