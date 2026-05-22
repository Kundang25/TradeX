import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import "../auth/auth.css";

const DASHBOARD_URL =
  // process.env.REACT_APP_DASHBOARD_URL || "http://localhost:3001";
  process.env.REACT_APP_DASHBOARD_URL || "https://google.com";

function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/api/login", form);

      if (data.success) {
        setSuccess(`Welcome back, ${data.name}! Opening dashboard…`);
        const params = new URLSearchParams({
          userId: data.userId,
          name: data.name,
          email: data.email,
        });
        setTimeout(() => {
          window.location.href = `${DASHBOARD_URL}?${params.toString()}`;
        }, 1200);
        return;
      }

      setError("Sign in failed. Please try again.");
    } catch (err) {
      const msg = err.response?.data?.message;
      if (err.response?.status === 503) {
        setError(
          msg ||
            "Database is not connected. Start the backend and ensure MONGO_URL is set in backend/.env"
        );
      } else {
        setError(
          msg ||
            "Unable to reach server. Make sure the backend is running on port 3002."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome back</h2>
        <p className="subtitle">Sign in to access your dashboard.</p>

        {success && (
          <div className="alert alert-success auth-alert" role="alert">
            {success}
          </div>
        )}
        {error && (
          <div className="alert alert-danger auth-alert" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="auth-footer">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
