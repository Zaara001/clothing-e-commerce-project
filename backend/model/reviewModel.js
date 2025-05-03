const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  product: {  // Changed from productId
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  user: {  // Changed from userId
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  }
}, { timestamps: true });  // Automatically adds createdAt and updatedAt

module.exports = mongoose.model("Review", reviewSchema);