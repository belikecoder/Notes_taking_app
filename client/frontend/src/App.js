import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OtpPage from "./pages/OTPPage";
import NotesPage from "./pages/NotesPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/otp" element={<OtpPage />} />
      <Route path="/notes" element={<NotesPage />} />
    </Routes>
  );
};

export default App;
