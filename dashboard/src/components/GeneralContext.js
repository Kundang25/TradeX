import React, { useState } from "react";
import { useMarketStore } from "../store/useMarketStore";
import { getUser } from "../utils/auth";

import BuyActionWindow from "./BuyActionWindow";

const GeneralContext = React.createContext({
  openBuyWindow: () => {},
  openSellWindow: () => {},
  closeOrderWindow: () => {},
  notifyOrderPlaced: () => {},
  ordersRefreshKey: 0,
  orderNotice: null,
});

export const GeneralContextProvider = (props) => {
  const [isOrderWindowOpen, setIsOrderWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [selectedStockPrice, setSelectedStockPrice] = useState(0);
  const [orderMode, setOrderMode] = useState("BUY");
  const [ordersRefreshKey, setOrdersRefreshKey] = useState(0);
  const [orderNotice, setOrderNotice] = useState(null);
  const fetchPortfolio = useMarketStore((s) => s.fetchPortfolio);

  const handleOpenOrderWindow = (uid, mode = "BUY", price = 0) => {
    setIsOrderWindowOpen(true);
    setSelectedStockUID(uid);
    setOrderMode(mode);
    setSelectedStockPrice(Number(price) || 0);
  };

  const handleCloseOrderWindow = () => {
    setIsOrderWindowOpen(false);
    setSelectedStockUID("");
    setOrderMode("BUY");
  };

  const notifyOrderPlaced = (mode, stockName, portfolioData) => {
    setOrdersRefreshKey((k) => k + 1);
    if (portfolioData) {
      useMarketStore.setState({ portfolio: portfolioData, loading: false });
    } else {
      const user = getUser();
      if (user?.userId) fetchPortfolio(user.userId);
    }
    setOrderNotice({
      type: "success",
      text: `${mode} order for ${stockName} executed successfully`,
    });
    setTimeout(() => setOrderNotice(null), 3500);
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: (uid, price) => handleOpenOrderWindow(uid, "BUY", price),
        openSellWindow: (uid, price) => handleOpenOrderWindow(uid, "SELL", price),
        closeOrderWindow: handleCloseOrderWindow,
        notifyOrderPlaced,
        ordersRefreshKey,
        orderNotice,
      }}
    >
      {orderNotice && (
        <div className={`order-toast order-toast-${orderNotice.type}`}>
          {orderNotice.text}
        </div>
      )}
      {props.children}
      {isOrderWindowOpen && (
        <BuyActionWindow
          uid={selectedStockUID}
          mode={orderMode}
          defaultPrice={selectedStockPrice}
        />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
