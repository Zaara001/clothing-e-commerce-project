const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

// ✅ Profile route
router.get("/", async (req, res) => {   
  try {
    console.log("🔎 Checking Access Token...");
    console.log("Cookies:", req.cookies);  // ✅ Log cookies to verify

    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: "No access token, not authenticated" });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
