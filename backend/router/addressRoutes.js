const express = require("express");
const Address = require("../model/addressModel");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/users", verifyToken, async (req, res) => {
    try {
      // Double-check authentication
      if (!req.userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
  
      // Validate address data
      const requiredFields = ['fullName', 'phone', 'street', 'city', 'state', 'pincode'];
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({ error: `${field} is required` });
        }
      }
  
      // Create address with explicit userId
      const addressData = {
        ...req.body,
        userId: req.userId // Using the userId set by middleware
      };
  
      const newAddress = new Address(addressData);
      const savedAddress = await newAddress.save();
      
      res.status(201).json(savedAddress);
    } catch (error) {
      console.error("Address creation error:", error);
      res.status(500).json({ 
        error: "Failed to save address",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

router.get("/users", verifyToken, async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.userId });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
});

router.delete("/users/:id", verifyToken, async (req, res) => {
  try {
    await Address.deleteOne({ _id: req.params.id, userId: req.userId });
    res.status(200).json({ message: "Address deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete address" });
  }
});

module.exports = router; 
