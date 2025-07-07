const User = require("../models/User");
const generateOTP = require("../utils/generateOtp");
const sendMail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");

// ✅ Signup: Create new user only if email doesn't exist
const signup = async (req, res) => {
  try {
    const { username, email, dateOfBirth } = req.body;

    if (!username || !email || !dateOfBirth) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const otp = generateOTP();

    const newUser = await User.create({
      username,
      email,
      dateOfBirth,
      otp,
      otpExpiration: Date.now() + 5 * 60 * 1000,
    });

    await sendMail(email, otp);
    return res.status(201).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Send OTP for login (email-only login)
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign up." });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiration = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendMail(email, otp);
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Verify OTP for both signup and login
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || Date.now() > user.otpExpiration) {
      return res.status(401).json({ message: "Invalid or expired OTP." });
    }

    user.otp = null;
    user.otpExpiration = null;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "OTP verified successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Optional fallback route
const login = async (req, res) => {
  return res.status(200).json({ message: "Login endpoint active. Use /send-otp instead." });
};

module.exports = {
  signup,
  sendOtp,
  verifyOTP,
  login,
};
