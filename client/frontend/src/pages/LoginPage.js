// File: src/pages/LoginPage.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import axios from "axios";
import "../styles/loginPage.css"; // Ensure this path is correct and styles are updated
import bgImage from "../assets/bg.jpg"; // Re-using the background image

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false); // For managing button state
  const [generalError, setGeneralError] = useState(""); // For API errors
  const [formErrors, setFormErrors] = useState({}); // For client-side validation errors

  const navigate = useNavigate();

  // Basic email validation regex
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

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
    e.preventDefault(); // Prevent default form submission
    setGeneralError(""); // Clear previous general errors

    if (!validateForm()) {
      return; // Stop if client-side validation fails
    }

    setIsLoading(true); // Disable button during submission
    try {
      // API call to send OTP for login
      const response = await axios.post("http://localhost:5000/api/auth/send-otp", { email: email.trim() });

      // Assuming your backend responds with a success status (e.g., 200)
      if (response.status === 200) {
        localStorage.setItem("email", email.trim()); // Store email for OTP verification page
        navigate("/otp"); // Redirect to OTP verification page
      } else {
        // Handle unexpected successful status codes with an error
        setGeneralError("Login failed: An unexpected error occurred.");
      }
    } catch (err) {
      console.error("Login error:", err);
      // More specific error messages based on backend response (if available)
      if (err.response && err.response.data && err.response.data.message) {
        setGeneralError(err.response.data.message);
      } else {
        setGeneralError("Login failed. Please check your email and try again.");
      }
    } finally {
      setIsLoading(false); // Re-enable button
    }
  };

  return (
    <main className="auth-page"> {/* Consistent layout wrapper */}
      <section className="auth-left">
        <div className="auth-left-content"> {/* Content wrapper for alignment */}
          <div className="auth-header">
            <h2>Highway Delite</h2> {/* Brand Name */}
            <h1>Welcome Back!</h1> {/* Main heading */}
            <p>Please sign in to your account to continue your journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate> {/* noValidate for custom validation */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setFormErrors(prev => ({...prev, email: null})); }} // Clear error on change
                required
                aria-required="true"
                autoComplete="email"
                aria-label="Email address"
                disabled={isLoading} // Disable input while loading
              />
              {formErrors.email && <p className="validation-error" role="alert">{formErrors.email}</p>}
            </div>

            {generalError && (
              <p className="error-message" role="alert" aria-live="polite">
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
            New here? <Link to="/signup">Create an account</Link> {/* Use Link */}
          </p>
        </div>
      </section>

      <aside className="auth-right">
        <img src={bgImage} alt="Abstract background illustrating connectivity and security" className="auth-bg-image" />
        <div className="overlay-text">
          <blockquote>
            "Seamless authentication for a seamless experience. Your data, secured."
          </blockquote>
          <p>— Highway Delite</p> {/* Slogan attribution */}
        </div>
      </aside>
    </main>
  );
};

export default LoginPage;