
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String },  // ✅ Added to store display name
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String }, 
    googleId: { type: String, unique: true, sparse: true }, 
    authProvider: { type: String, enum: ["local", "google"], default: "local" }, 
    restPasswordToken: { type: String },
    restPasswordExpires: { type: Date },
    role: { type: String, enum: ["customer", "admin", "seller"], default: "customer" } 
}, { timestamps: true }); 

const User = mongoose.model("User", UserSchema);

module.exports = User;
