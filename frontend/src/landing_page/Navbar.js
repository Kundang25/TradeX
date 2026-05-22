import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    
      <nav class="navbar navbar-expand-lg bg-white border-bottom sticky-top">
        <div class="container p-2">
          <Link class="navbar-brand" to="/">
            <img src="media/images/logo.svg"  alt="Logo" style={{width:"25%"}}/>
          </Link>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse" 
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            
            <form class="d-flex" role="search">
            <ul class="navbar-nav mb-lg-0">
              <li class="nav-item">
                <Link class="nav-link active" aria-current="page" to="/signin">
                  Sign in
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link active" aria-current="page" to="/signup">
                  Sign up
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link active" aria-current="page" to="/about">
                  About
                </Link> 
              </li>
              <li class="nav-item">
                <Link class="nav-link active" aria-current="page" to="/product">
                  Product
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link active" aria-current="page" to="/pricing">
                  Pricing
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link active" aria-current="page" to="/support">
                  Support 
                </Link>
              </li>
              
            </ul>
            </form>
          </div>
        </div>
      </nav>
    
  );
}

export default Navbar;

// import React from "react";
// import { Link } from "react-router-dom";

// function Navbar() {
//   return (
//     <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
//       <div className="container p-2">
//         <Link className="navbar-brand" to="/">
//           <img
//             src="media/images/logo.svg"
//             alt="Logo"
//             style={{ width: "25%" }}
//           />
//         </Link>

//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarSupportedContent"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         <div className="collapse navbar-collapse" id="navbarSupportedContent">
//           <ul className="navbar-nav ms-auto mb-lg-0">

//             <li className="nav-item">
//               <Link className="nav-link" to="/signup">
//                 Signup
//               </Link>
//             </li>

//             {/* ✅ NEW LOGIN BUTTON */}
//             <li className="nav-item">
//               <Link className="nav-link" to="/login">
//                 Login
//               </Link>
//             </li>

//             <li className="nav-item">
//               <Link className="nav-link" to="/about">
//                 About
//               </Link>
//             </li>

//             <li className="nav-item">
//               <Link className="nav-link" to="/product">
//                 Product
//               </Link>
//             </li>

//             <li className="nav-item">
//               <Link className="nav-link" to="/pricing">
//                 Pricing
//               </Link>
//             </li>

//             <li className="nav-item">
//               <Link className="nav-link" to="/support">
//                 Support
//               </Link>
//             </li>

//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;
