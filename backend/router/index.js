const express = require('express');
const User = require('../model');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils');
const { verify } = require('jsonwebtoken');
const verifyToken = require('../middleware');  // Since the file is 'index.js' inside 'middleware' folder
const nodemailer = require('nodemailer');
const { text } = require('body-parser');

const router = express.Router();

router.get("/test", (req, res) =>
    res.json({ message: 'API testing successful' })  // Corrected spelling
);

router.post("/user", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ email, password: hashedPassword });

        await newUser.save();

        return res.status(201).json({ message: 'User Created' });
    }

    res.status(404).json({ message: 'User already exists' });  // Corrected spelling
});

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password" });
    }

    const token = generateToken(user);
    res.json({ token });
});

router.get('/data', verifyToken, (req, res) => {
    res.json({ message: `Welcome ${req.user.email}! This is protected data.` });
});

router.post("/reset-password", async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status (404).json({ message: "User not found" });
    }

    const token = Math.random().toString(36).slice(-8);
    user.restPasswordToken = token;
    user.restPasswordExpires = Date.now() + 3600000;

    await user.save();

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "nivethethaelango@gmail.com",
            pass: "lzbu ftbp druy axwy"
        },
    });

    const message = {
        from: "nivethethaelango@gmail.com",
        to: user.email,
        subject: "Password reset request",
        text: `You are receiving this email because you (or someone else) has requested a password reset for your account.\n\n Please use the following token to reset your password: ${token}\n\n If you did not request a password reset, please ignore this email.`
    };

    transporter.sendMail(message, (err, info) => {
        if (err) {
            res.status(404).json({ message: "Something went wrong, please try again!" });
        }
        res.status(200).json({ message: "Password reset email sent" + info.response });
    });
});

router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
        restPasswordToken: token.trim(),
        restPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(404).json({ message: "Invalid token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);  
    user.password = hashedPassword;
    user.restPasswordToken = null;
    user.restPasswordExpires = null;

    await user.save();

    res.json({ message: "Password reset successfully" }); 
});

module.exports = router;

