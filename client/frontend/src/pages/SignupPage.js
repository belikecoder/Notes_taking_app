// File: src/pages/SignupPage.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/signupPage.css";
import bgImage from "../assets/bg.jpg";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (!username.trim()) {
      errors.username = "Username is required.";
    } else if (username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters.";
    }

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email address.";
    }

    if (!dob) {
      errors.dob = "Date of Birth is required.";
    } else {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      if (age < 18) errors.dob = "You must be at least 18 years old.";
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
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        username: username.trim(),
        email: email.trim(),
        dateOfBirth: dob,
      });

      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("email", email.trim());
        navigate("/otp");
      } else {
        setGeneralError("Signup failed: Unexpected response.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        if (err.response.data.message.includes("already exists")) {
          setFormErrors((prev) => ({ ...prev, email: err.response.data.message }));
        } else {
          setGeneralError(err.response.data.message);
        }
      } else {
        setGeneralError("Signup failed. Please try again.");
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
            <h1>Create Your Account</h1>
            <p>Join Highway Delite to start your journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setFormErrors((prev) => ({ ...prev, username: null }));
                }}
                disabled={isLoading}
              />
              {formErrors.username && <p className="validation-error">{formErrors.username}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFormErrors((prev) => ({ ...prev, email: null }));
                }}
                disabled={isLoading}
              />
              {formErrors.email && <p className="validation-error">{formErrors.email}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                id="dob"
                value={dob}
                onChange={(e) => {
                  setDob(e.target.value);
                  setFormErrors((prev) => ({ ...prev, dob: null }));
                }}
                disabled={isLoading}
              />
              {formErrors.dob && <p className="validation-error">{formErrors.dob}</p>}
            </div>

            {generalError && <p className="error-message">{generalError}</p>}

            <button type="submit" className="primary-button" disabled={isLoading}>
              {isLoading ? <><span className="spinner"></span> Sending OTP...</> : "Send OTP"}
            </button>
          </form>

          <p className="switch-link">
            Already have an account? <Link to="/">Sign in</Link>
          </p>
        </div>
      </section>

      <aside className="auth-right">
        <img src={bgImage} alt="Illustration" />
        <div className="overlay-text">
          <blockquote>"Discover new routes, connect with fellow travelers."</blockquote>
          <p>— Highway Delite</p>
        </div>
      </aside>
    </main>
  );
};

export default SignupPage;
