const mongoose = require('mongoose');

const SellerSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    restPasswordToken: { type: String },
    restPasswordExpires: { type: Date },
    businessName: { type: String, required: true },
    gstNumber: { type: String, required: true },
    bankDetails: { 
        accountNumber: { type: String, required: true },
        bankName: { type: String, required: true },
        ifscCode: { type: String, required: true },
    },
    role: { type: String, default: "seller" } // Default role set to seller
});

const Seller = mongoose.model("Seller", SellerSchema);

module.exports = Seller;
