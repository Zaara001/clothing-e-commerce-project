const express = require('express');
const Seller = require('../model/sellerSchema'); // Updated to use the seller schema
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateJwt');
const { verify } = require('jsonwebtoken');
const verifyToken = require('../middleware/authMiddleware');
const nodemailer = require('nodemailer');
const VerifySeller = require('../middleware/sellerAuthMiddleware');

const router = express.Router();

// Seller Sign-Up
router.post('/seller/signup', async (req, res) => {
    const { email, password, businessName, gstNumber, bankDetails } = req.body;

    // Check if the seller already exists
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
        return res.status(400).json({ message: 'Seller already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new seller
    const newSeller = new Seller({
        email,
        password: hashedPassword,
        businessName,
        gstNumber,
        bankDetails: {
            accountNumber: bankDetails.accountNumber,
            bankName: bankDetails.bankName,
            ifscCode: bankDetails.ifscCode
        }
    });

    await newSeller.save();
    res.status(201).json({ message: 'Seller registered successfully' });
});

// Seller Login
router.post('/seller/login', async (req, res) => {
    const { email, password } = req.body;

    const seller = await Seller.findOne({ email });

    if (!seller) {
        return res.status(404).json({ message: "Seller not found" });
    }

    const isMatch = await bcrypt.compare(password, seller.password);

    if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password" });
    }

    const token = generateToken(seller);  // Generate JWT for seller
    res.json({ token });
});

// Seller protected route (only accessible to logged-in sellers)
router.get('/seller/data', VerifySeller, async (req, res) => {
    const seller = await Seller.findById(req.Sellers.id);
    if (!seller) {
        return res.status(403).json({ message: 'Seller data not found' });
    }
    res.json({ message: `Welcome ${seller.email}, This is seller data.` });
});

// Reset Password (for Seller)
router.post('/seller/reset-password', async (req, res) => {
    const { email } = req.body;

    const seller = await Seller.findOne({ email });

    if (!seller) {
        return res.status(404).json({ message: "Seller not found" });
    }

    const token = Math.random().toString(36).slice(-8);
    seller.restPasswordToken = token;
    seller.restPasswordExpires = Date.now() + 3600000;

    await seller.save();

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
    });

    const message = {
        from: process.env.EMAIL_USER,
        to: seller.email,
        subject: "Password reset request",
        text: `You are receiving this email because you (or someone else) has requested a password reset for your seller account.\n\n Please use the following token to reset your password: ${token}\n\n If you did not request a password reset, please ignore this email.`
    };

    transporter.sendMail(message, (err, info) => {
        if (err) {
            return res.status(404).json({ message: "Something went wrong, please try again!" });
        }
        res.status(200).json({ message: "Password reset email sent" + info.response });
    });
});

// Reset Password (by token, for Seller)
router.post('/seller/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const seller = await Seller.findOne({
        restPasswordToken: token.trim(),
        restPasswordExpires: { $gt: Date.now() }
    });

    if (!seller) {
        return res.status(404).json({ message: "Invalid token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    seller.password = hashedPassword;
    seller.restPasswordToken = null;
    seller.restPasswordExpires = null;

    await seller.save();

    res.json({ message: "Password reset successfully" });
});

module.exports = router;
