const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String }, // Made optional for OAuth users
    googleId: { type: String, unique: true, sparse: true }, // Google OAuth support
    authProvider: { type: String, enum: ["local", "google"], default: "local" }, // Track auth method
    restPasswordToken: { type: String },
    restPasswordExpires: { type: Date },
    role: { type: String, enum: ["customer", "admin", "seller"], default: "customer" } // More roles
}, { timestamps: true }); // Adds createdAt & updatedAt fields

const User = mongoose.model("User", UserSchema);

module.exports = User;
