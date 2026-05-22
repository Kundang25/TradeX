import React, { useEffect, useState } from "react";
import { Toaster } from "sonner";

import AuthGuard from "./AuthGuard";
import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import { initAuthFromUrl, getUser } from "../utils/auth";
import { useMarketStore } from "../store/useMarketStore";

const Home = () => {
  const [user, setUser] = useState(null);
  const startLiveUpdates = useMarketStore((s) => s.startLiveUpdates);

  useEffect(() => {
    initAuthFromUrl();
    const u = getUser();
    setUser(u);
    if (u?.userId) {
      const cleanup = startLiveUpdates(u.userId);
      return cleanup;
    }
  }, [startLiveUpdates]);

  return (
    <AuthGuard onAuthenticated={setUser}>
      <Toaster position="top-center" richColors closeButton />
      <TopBar user={user} />
      <Dashboard />
    </AuthGuard>
  );
};

export default Home;
