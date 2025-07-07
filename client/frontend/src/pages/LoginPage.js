import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/loginPage.css";
import bgImage from "../assets/bg.jpg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = "Email address is required.";
    } else if (!isValidEmail(email)) {
      errors.email = "Please enter a valid email address.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/send-otp`,
        { email: email.trim() }
      );

      if (response.status === 200) {
        localStorage.setItem("email", email.trim());
        navigate("/otp");
      } else {
        setGeneralError("Login failed: Unexpected response from server.");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.data?.message) {
        setGeneralError(err.response.data.message);
      } else {
        setGeneralError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-left">
        <div className="auth-left-content">
          <div className="auth-header">
            <h2>Highway Delite</h2>
            <h1>Welcome Back!</h1>
            <p>Please sign in to your account to continue your journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFormErrors((prev) => ({ ...prev, email: null }));
                }}
                required
                autoComplete="email"
                disabled={isLoading}
              />
              {formErrors.email && (
                <p className="validation-error" role="alert">
                  {formErrors.email}
                </p>
              )}
            </div>

            {generalError && (
              <p className="error-message" role="alert">
                {generalError}
              </p>
            )}

            <button type="submit" className="primary-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span> Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </button>
          </form>

          <p className="switch-link">
            New here? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </section>

      <aside className="auth-right">
        <img
          src={bgImage}
          alt="Abstract background illustrating connectivity and security"
          className="auth-bg-image"
        />
        <div className="overlay-text">
          <blockquote>
            "Seamless authentication for a seamless experience. Your data, secured."
          </blockquote>
          <p>— Highway Delite</p>
        </div>
      </aside>
    </main>
  );
};

export default LoginPage;
