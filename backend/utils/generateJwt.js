const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// ✅ Generate Access Token (extend to 1 hour for better UX)
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// ✅ Generate Refresh Token (keep 7 days)
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id, name: user.name }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

module.exports = { generateAccessToken, generateRefreshToken };