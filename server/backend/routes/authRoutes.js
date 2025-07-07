const express = require("express");
const router = express.Router();
const { signup, sendOtp, verifyOTP, login } = require("../controllers/authController");

router.post("/signup", signup);            // email + username + dob -> signup
router.post("/send-otp", sendOtp);         // email only -> login
router.post("/verify-otp", verifyOTP);     // email + otp -> verify
router.post("/login", login);              // optional fallback

module.exports = router;
