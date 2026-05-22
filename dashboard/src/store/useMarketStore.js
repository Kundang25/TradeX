import { create } from "zustand";
import api from "../api/api";

export const useMarketStore = create((set, get) => ({
  market: [],
  portfolio: null,
  loading: true,

  getStockPrice: (symbol) => {
    const stock = get().market.find((s) => s.symbol === symbol);
    return stock?.price ?? 0;
  },

  fetchMarket: async () => {
    try {
      const { data } = await api.get("/api/market");
      set({ market: data });
    } catch (e) {
      console.error("Market fetch failed", e);
    }
  },

  fetchPortfolio: async (userId) => {
    if (!userId) return;
    try {
      const { data } = await api.get("/api/portfolio/summary", {
        params: { userId },
      });
      set({ portfolio: data, loading: false });
    } catch (e) {
      set({ loading: false });
    }
  },

  refreshAll: async (userId) => {
    await Promise.all([get().fetchMarket(), get().fetchPortfolio(userId)]);
  },

  startLiveUpdates: (userId) => {
    get().refreshAll(userId);
    const id = setInterval(() => {
      get().refreshAll(userId);
    }, 3000);
    return () => clearInterval(id);
  },
}));
