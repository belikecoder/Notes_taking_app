import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/otpPage.css";
import bgImage from "../assets/bg.jpg";

const OTPPage = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [resendCooldown, setResendCooldown] = useState(60);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const email = localStorage.getItem("email");
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL; // ✅ Use env variable

  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer;
    if (cooldownActive && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    } else if (resendCooldown === 0) {
      setCooldownActive(false);
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [cooldownActive, resendCooldown]);

  const validateForm = () => {
    const errors = {};
    if (!otp.trim()) {
      errors.otp = "OTP is required.";
    } else if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      errors.otp = "Please enter a valid 6-digit OTP.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setSuccessMessage("");

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/verify-otp`, {
        email,
        otp: otp.trim(),
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/notes");
    } catch (err) {
      console.error("OTP verification error:", err);
      setGeneralError(
        err?.response?.data?.message ||
          "Invalid OTP or an error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setGeneralError("");
    setSuccessMessage("");

    if (!email) {
      setGeneralError("Email not found. Please go back to sign-in.");
      return;
    }
    if (cooldownActive) return;

    setIsResending(true);
    setCooldownActive(true);
    setResendCooldown(60);

    try {
      await axios.post(`${API_URL}/api/auth/send-otp`, { email });
      setSuccessMessage("A new OTP has been sent to your email!");
    } catch (err) {
      console.error("Resend OTP error:", err);
      setGeneralError(
        err?.response?.data?.message || "Failed to resend OTP. Try later."
      );
      setCooldownActive(false);
      setResendCooldown(0);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-left">
        <div className="auth-left-content">
          <div className="auth-header">
            <h2>Highway Delite</h2>
            <h1>Verify Your OTP</h1>
            {email ? (
              <p>
                An OTP has been sent to <strong>{email}</strong>. Enter it below
                to verify your account.
              </p>
            ) : (
              <p className="error-message">
                Email not found. Please go back to the sign-in/sign-up page.
              </p>
            )}
          </div>

          <form onSubmit={handleVerify} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="otp">One-Time Password (OTP)</label>
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val) && val.length <= 6) {
                    setOtp(val);
                    setFormErrors((prev) => ({ ...prev, otp: null }));
                  }
                }}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="6"
                required
                aria-required="true"
                aria-label="Enter your One-Time Password"
                disabled={isLoading || !email}
              />
              {formErrors.otp && (
                <p className="validation-error" role="alert">
                  {formErrors.otp}
                </p>
              )}
            </div>

            {generalError && (
              <p className="error-message" role="alert">
                {generalError}
              </p>
            )}
            {successMessage && (
              <p className="success-message" role="status">
                {successMessage}
              </p>
            )}

            <button
              type="submit"
              className="primary-button"
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span> Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>
          </form>

          <div className="otp-actions">
            <p className="resend-otp-link">
              Didn't receive OTP?{" "}
              <button
                onClick={handleResendOtp}
                disabled={isResending || cooldownActive || !email}
                className="text-button"
                aria-live="polite"
              >
                {isResending ? (
                  <>
                    <span className="spinner small"></span> Resending...
                  </>
                ) : cooldownActive ? (
                  `Resend (${resendCooldown}s)`
                ) : (
                  "Resend OTP"
                )}
              </button>
            </p>
            <p className="switch-link">
              <Link to="/">Back to Sign in</Link>
            </p>
          </div>
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
            "Your journey secured, one verification at a time."
          </blockquote>
          <p>— Highway Delite</p>
        </div>
      </aside>
    </main>
  );
};

export default OTPPage;
