const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// ✅ Generate Access Token (expires in 15 minutes)
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

// ✅ Generate Refresh Token (expires in 7 days)
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id, name: user.name }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

module.exports = { generateAccessToken, generateRefreshToken };