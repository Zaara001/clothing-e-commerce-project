const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  authProvider: { type: String, enum: ["local", "google"], default: "local" },
  restPasswordToken: { type: String },
  restPasswordExpires: { type: Date },
  role: { type: String, enum: ["customer", "admin", "seller"], default: "customer" },

  // ✅ Add selectedColor and selectedSize
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // match your product model name
      },
      quantity: {
        type: Number,
        default: 1,
      },
      selectedColor: { // Store selected color
        type: String,
        required: true,
      },
      selectedSize: { // Store selected size
        type: String,
        required: true,
      },
    },
  ],
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

module.exports = User;
