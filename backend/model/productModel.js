const mongoose = require('mongoose');

// Define Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Product name
    description: { type: String, required: true }, // Product description
    material: { type: String, required: true }, // Fabric/material details
    sizeOptions: [String], // Array of available sizes
    colorOptions: [String], // Array of available colors
    careInstructions: { type: String }, // Care instructions
    brandName: { type: String }, // Brand name, optional
    price: { type: Number, required: true }, // Product price
    discount: { type: Number, default: 0 }, // Discount percentage
    shippingCost: { type: Number, required: true }, // Shipping cost
    images: [String], // Array of image URLs
    quantity: { type: Number, required: true }, // Quantity available for sale
    sku: { type: String, unique: true, required: true }, // Unique identifier for the product
    status: { 
        type: String, 
        enum: ['Pending Approval', 'Active', 'Inactive'], // Status: Pending, Active, or Inactive
        default: 'Pending Approval' 
    },
    seller: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Seller', 
        required: true // Reference to the seller who owns the product
    },
}, { timestamps: true }); // Include timestamps for creation and updates

// Create Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
