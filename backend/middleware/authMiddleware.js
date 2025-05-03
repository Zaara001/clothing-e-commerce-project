const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const Seller = require("../model/sellerSchema");
require("dotenv").config();

const verifyToken = async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token && req.cookies?.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token) {
        return res.status(401).json({ message: "Missing or invalid token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.id) || await Seller.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        req.user = user;
        req.userId = user._id;
        next();
    } catch (err) {
       
        if (err.name === "TokenExpiredError") {
            return res.status(403).json({ message: "Token expired" });
        }
        if (err.name === "JsonWebTokenError") {
            return res.status(403).json({ message: "Invalid token" });
        }
        
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = verifyToken;