import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import "../auth/auth.css";

const DASHBOARD_URL =
  process.env.REACT_APP_DASHBOARD_URL || "https://trade-dashboard-omega.vercel.app"
function SignUp() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      const { data } = await api.post("/api/signup", form);

      if (data.success) {
        setSuccess("Account created! Redirecting to your dashboard…");
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

      setError("Signup failed. Please try again.");
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
        <h2>Create your account</h2>
        <p className="subtitle">Start trading with TradeStream in minutes.</p>

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
            <label htmlFor="name" className="form-label">
              Full name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Your name"
            />
          </div>

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
              minLength={6}
              placeholder="At least 6 characters"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
