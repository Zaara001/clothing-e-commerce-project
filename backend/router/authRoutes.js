const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../model/userModel");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateJwt");

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });

  await newUser.save();

  const accessToken = generateAccessToken(newUser);
  const refreshToken = generateRefreshToken(newUser);

  // Set cookies
  res.cookie("accessToken", accessToken, { httpOnly: true, secure: false, sameSite: "Lax" });
  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false, sameSite: "Lax" });

  res.status(201).json({
    message: "User registered successfully",
    user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
    accessToken,
  });
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set cookies
    res.cookie("accessToken", accessToken, { httpOnly: true, secure: false, sameSite: "Lax" });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false, sameSite: "Lax" });

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Google OAuth for Users
router.get(
  "/auth/google",
  passport.authenticate("google-user", {
    scope: ["profile", "email"],
    prompt: "select_account consent",
  })
);

// Google OAuth callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google-user", { failureRedirect: "/login", session: false }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const accessToken = generateAccessToken(req.user);
    const refreshToken = generateRefreshToken(req.user);

    // Set cookies
    res.cookie("accessToken", accessToken, { httpOnly: true, secure: false, sameSite: "Lax" });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false, sameSite: "Lax" });

    // ✅ Redirect to your frontend with the tokens
    res.redirect(`http://localhost:5173/`);
  }
);


// Refresh Token
router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(403).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateAccessToken(decoded.id);

    res.cookie("accessToken", accessToken, { httpOnly: true, secure: false, sameSite: "Lax" });

    res.json({ accessToken });
  } catch (error) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
});

// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
});

module.exports = router;