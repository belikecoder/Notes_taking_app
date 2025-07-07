// File: src/pages/OTPPage.js
import React, { useState, useEffect } from "react"; // Import useEffect for cooldown timer
import { useNavigate, Link } from "react-router-dom"; // Import Link
import axios from "axios";
import "../styles/otpPage.css"; // Make sure this CSS file exists and contains relevant styles
import bgImage from "../assets/bg.jpg"; // Re-using the background image

const OTPPage = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false); // For verifying OTP
  const [isResending, setIsResending] = useState(false); // For resend OTP button
  const [generalError, setGeneralError] = useState(""); // For displaying API error messages
  const [formErrors, setFormErrors] = useState({}); // For client-side validation errors
  const [resendCooldown, setResendCooldown] = useState(60); // Cooldown in seconds
  const [cooldownActive, setCooldownActive] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // For resend success messages

  const email = localStorage.getItem("email"); // Get email from local storage

  const navigate = useNavigate();

  // Redirect if email is not found (user landed here without login/signup flow)
  useEffect(() => {
    if (!email) {
      navigate("/"); // Redirect to login if no email is found
      // Consider using a toast notification instead of alert for better UX
      // alert("Please enter your email first to receive an OTP.");
    }
  }, [email, navigate]);

  // Cooldown timer effect for resend OTP
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
    return () => clearInterval(timer); // Cleanup timer on unmount or if dependencies change
  }, [cooldownActive, resendCooldown]);

  const validateForm = () => {
    const errors = {};
    if (!otp.trim()) {
      errors.otp = "OTP is required.";
    } else if (otp.length !== 6 || !/^\d+$/.test(otp)) { // Strict 6-digit numeric check
      errors.otp = "Please enter a valid 6-digit OTP.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setGeneralError(""); // Clear previous general errors
    setSuccessMessage(""); // Clear any success messages

    if (!validateForm()) {
      return; // Stop if client-side validation fails
    }

    setIsLoading(true); // Disable button during submission
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp: otp.trim(), // Send trimmed OTP
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/notes"); // Redirect to dashboard/notes page
    } catch (err) {
      console.error("OTP verification error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setGeneralError(err.response.data.message); // Use message from backend if available
      } else {
        setGeneralError("Invalid OTP or an error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false); // Re-enable button
    }
  };

  const handleResendOtp = async () => {
    setGeneralError(""); // Clear any previous errors
    setSuccessMessage(""); // Clear any previous success messages

    if (!email) {
      setGeneralError("Email not found. Please go back to the sign-in/sign-up page.");
      return;
    }
    if (cooldownActive) {
      return; // Prevent resending if cooldown is active
    }

    setIsResending(true);
    setCooldownActive(true); // Activate cooldown
    setResendCooldown(60); // Reset cooldown timer

    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", { email });
      setSuccessMessage("A new OTP has been sent to your email!");
    } catch (err) {
      console.error("Resend OTP error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setGeneralError(err.response.data.message);
      } else {
        setGeneralError("Failed to resend OTP. Please try again later.");
      }
      setCooldownActive(false); // Stop cooldown if resend failed immediately
      setResendCooldown(0); // Reset cooldown if failed
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="auth-page"> {/* Consistent layout wrapper */}
      <section className="auth-left">
        <div className="auth-left-content"> {/* Content wrapper for alignment */}
          <div className="auth-header">
            <h2>Highway Delite</h2> {/* Brand Name */}
            <h1>Verify Your OTP</h1> {/* Specific heading for OTP page */}
            {email ? (
              <p>An OTP has been sent to <strong>{email}</strong>. Please enter it below to verify your account.</p>
            ) : (
              <p className="error-message">Email not found. Please go back to the sign-in/sign-up page to request an OTP.</p>
            )}
          </div>

          <form onSubmit={handleVerify} className="auth-form" noValidate> {/* noValidate for custom validation */}
            <div className="form-group">
              <label htmlFor="otp">One-Time Password (OTP)</label>
              <input
                type="text" // Keep as text to allow pasting, but use inputmode for mobile
                id="otp"
                name="otp"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => {
                  const val = e.target.value;
                  // Allow only digits and limit to 6 characters
                  if (/^\d*$/.test(val) && val.length <= 6) {
                    setOtp(val);
                    setFormErrors(prev => ({...prev, otp: null})); // Clear error on change
                  }
                }}
                inputMode="numeric" // Optimizes keyboard for numeric input on mobile
                pattern="[0-9]*" // Hint for browsers for numeric input
                maxLength="6" // Ensure maximum 6 digits
                required
                aria-required="true"
                aria-label="Enter your One-Time Password"
                disabled={isLoading || !email} // Disable if loading or email missing
              />
              {formErrors.otp && <p className="validation-error" role="alert">{formErrors.otp}</p>}
            </div>

            {generalError && (
              <p className="error-message" role="alert" aria-live="polite">
                {generalError}
              </p>
            )}
            {successMessage && (
              <p className="success-message" role="status" aria-live="polite">
                {successMessage}
              </p>
            )}

            <button type="submit" className="primary-button" disabled={isLoading || !email}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>
          </form>

          <div className="otp-actions">
            <p className="resend-otp-link">
              Didn't receive OTP? {" "}
              <button
                onClick={handleResendOtp}
                disabled={isResending || cooldownActive || !email} // Disable if resending, cooldown active, or email missing
                className="text-button" // Apply a text-button class for styling
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
              <Link to="/">Back to Sign in</Link> {/* Use Link for navigation */}
            </p>
          </div>
        </div>
      </section>

      <aside className="auth-right">
        <img src={bgImage} alt="Abstract background illustrating connectivity and security" className="auth-bg-image" />
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