import React, { useEffect, useState } from "react";

import { getUser, initAuthFromUrl } from "../utils/auth";

const FRONTEND_SIGNIN =
  `${process.env.REACT_APP_FRONTEND_URL || "https://trade-frontend-sigma.vercel.app/"}/signin`;

const AuthGuard = ({ children, onAuthenticated }) => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    initAuthFromUrl();
    const user = getUser();

    if (user?.userId) {
      setStatus("authenticated");
      onAuthenticated?.(user);
    } else {
      setStatus("redirecting");
      window.location.href = FRONTEND_SIGNIN;
    }
  }, [onAuthenticated]);

  if (status === "loading" || status === "redirecting") {
    return (
      <div className="auth-guard-screen">
        <p>{status === "loading" ? "Loading…" : "Redirecting to sign in…"}</p>
        <a href={FRONTEND_SIGNIN}>Sign in</a>
      </div>
    );
  }

  return children;
};

export default AuthGuard;
