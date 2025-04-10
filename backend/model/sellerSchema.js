const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  businessName: {
    type: String,
    default: '',
  },
  gstNumber: {
    type: String,
    default: '',
  },
  bankDetails: {
    accountNumber: {
      type: String,
      default: '',
    },
    bankName: {
      type: String,
      default: '',
    },
    ifscCode: {
      type: String,
      default: '',
    },
  },
  role: {
    type: String,
    default: 'seller',
  },
  isProfileComplete: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Seller', sellerSchema);