const express = require("express");
const passport = require("passport");
const Seller = require("../model/sellerSchema");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateJwt");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// Google OAuth for Sellers
router.get(
  "/auth/google/seller",
  passport.authenticate("google-seller", {
    scope: ["profile", "email"],
    prompt: "select_account consent",
  })
);

// Google OAuth Callback for Sellers
router.get(
  "/auth/google/callback/seller",
  passport.authenticate("google-seller", { failureRedirect: "/login", session: false }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const { email } = req.user;

    try {
      const seller = await Seller.findOne({ email });

      if (seller && seller.isProfileComplete) {
        const accessToken = generateAccessToken(seller);
        const refreshToken = generateRefreshToken(seller);

        res.cookie("accessToken", accessToken, { httpOnly: true, secure: false, sameSite: "Lax" });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false, sameSite: "Lax" });

        res.redirect("http://localhost:5173/seller/dashboard");
      } else {
        const accessToken = generateAccessToken(req.user);
        const refreshToken = generateRefreshToken(req.user);

        res.cookie("accessToken", accessToken, { httpOnly: true, secure: false, sameSite: "Lax" });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false, sameSite: "Lax" });

        res.redirect(`http://localhost:5173/seller/register?email=${encodeURIComponent(email)}`);
      }
    } catch (error) {
      console.error("Error in Google callback:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Seller Registration Endpoint
router.post("/register", async (req, res) => {
  const { email, businessName, gstNumber, bankDetails } = req.body;

  try {
    const seller = await Seller.findOneAndUpdate(
      { email: { $regex: new RegExp(`^${email}$`, "i") } },
      { businessName, gstNumber, bankDetails, isProfileComplete: true },
      { new: true, upsert: true }
    );

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json({ message: "Seller profile updated successfully", seller });
  } catch (error) {
    console.error("Error updating seller profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get current seller
router.get("/me", verifyToken, async (req, res) => {
  try {
    console.log("Authenticated user from token:", req.user);

    const seller = await Seller.findById(req.user._id);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json({ seller });
  } catch (error) {
    console.error("Error fetching seller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Logout Route
router.get("/logout", (req, res) => {
  res.clearCookie("accessToken", { sameSite: "Lax", httpOnly: true });
  res.clearCookie("refreshToken", { sameSite: "Lax", httpOnly: true });
  res.status(200).json({ message: "Logged out successfully" });
});


module.exports = router;
