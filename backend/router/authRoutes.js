const express = require("express");
const passport = require("passport");
const session = require("express-session");
const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateJwt");
const verifyToken = require("../middleware/authMiddleware");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

dotenv.config();

const router = express.Router();

// Session setup for Passport (Required for OAuth)
router.use(
    session({
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: true,
    })
);
router.use(passport.initialize());
router.use(passport.session());

// Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log("Google Profile:", profile); // Debugging

                let user = await User.findOne({ email: profile.emails[0].value });

                if (!user) {
                    user = new User({
                        email: profile.emails[0].value,
                        googleId: profile.id,
                        name: profile.displayName,
                        profilePicture: profile.photos[0].value, // Store profile picture
                    });
                    await user.save();
                }

                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

// **Force Consent Screen by Adding 'prompt: consent'**
router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["openid", "profile", "email"], prompt: "consent" })
);

// Google OAuth Callback
router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    async (req, res) => {
        console.log("Authenticated User:", req.user); // Debugging

        const token = generateToken(req.user);
        res.redirect(`http://localhost:5173/?token=${token}`);
    }
);

// Logout Route
router.get("/logout", (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect("http://localhost:5173/");
});

// **Test Route**
router.get("/test", (req, res) => res.json({ message: "API testing successful" }));

// **Normal User Signup/Login**
router.post("/user", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        return res.status(201).json({ message: "User Created" });
    }

    res.status(409).json({ message: "User already exists" });
});

router.post("/authenticate", async (req, res) => {
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

// **Protected Route (Requires Auth)**
router.get("/data", verifyToken, (req, res) => {
    res.json({ message: `Welcome ${req.user.email}! This is protected data.` });
});

// **Password Reset Flow**
router.post("/reset-password", async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const token = Math.random().toString(36).slice(-8);
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const message = {
        from: "nivethethaelango@gmail.com",
        to: user.email,
        subject: "Password reset request",
        text: `You are receiving this email because you (or someone else) has requested a password reset.\n\nUse this token: ${token}\n\nIf you did not request this, ignore this email.`,
    };

    transporter.sendMail(message, (err, info) => {
        if (err) {
            return res.status(500).json({ message: "Something went wrong, please try again!" });
        }
        res.status(200).json({ message: "Password reset email sent: " + info.response });
    });
});

router.post("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
        resetPasswordToken: token.trim(),
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(404).json({ message: "Invalid token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.json({ message: "Password reset successfully" });
});

module.exports = router;
