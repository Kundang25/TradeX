import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://tradex-3fzl.onrender.com";
  // process.env.REACT_APP_API_URL || "http://localhost:3002";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export default api;
