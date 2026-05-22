import React, { useState } from "react";

import AuthGuard from "./AuthGuard";
import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

const Home = () => {
  const [user, setUser] = useState(null);

  return (
    <AuthGuard onAuthenticated={setUser}>
      <TopBar user={user} />
      <Dashboard />
    </AuthGuard>
  );
};

export default Home;
