const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const Seller = require("../model/sellerSchema");
require("dotenv").config();

const verifyToken = async (req, res, next) => {
    let token;

    // ✅ Check Authorization header
    if (req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    // ✅ Check token in cookies if not in header
    if (!token && req.cookies?.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token) {
        return res.status(401).json({ message: "Missing or invalid token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // ✅ Find User (Either normal user or seller)
        const user = await User.findById(decoded.id) || await Seller.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Attach user/seller to request
        req.user = user;
        next();
    } catch (err) {
        // ✅ Handle specific JWT errors
        if (err.name === "TokenExpiredError") {
            return res.status(403).json({ message: "Token expired" });
        }
        if (err.name === "JsonWebTokenError") {
            return res.status(403).json({ message: "Invalid token" });
        }
        // ✅ Generic error for other issues
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = verifyToken;