const mongoose = require('mongoose');

// Define Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    material: { type: String, required: true },
    sizeOptions: [String],
    colorOptions: [String],
    careInstructions: { type: String },
    brandName: { type: String },
    originalPrice: { type: Number, required: true },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    price: { 
        type: Number, 
        required: true,
        default: function() {
          return Math.round(this.originalPrice * (1 - (this.discount / 100)))
        }
      },
    shippingCost: { type: Number, required: true },
    images: [String],
    quantity: { type: Number, required: true },
    sku: { type: String, unique: true, required: true },

    // 🆕 Newly Added Fields
    transparency: {
        type: String,
        enum: ['Sheer', 'Semi-Sheer', 'Opaque']
    },
    occasions: [{ type: String }], // e.g., ['Casual', 'Party', 'Wedding']
    countryOfOrigin: { type: String },
    manufactureDetails: { type: String },
    itemWeight: { type: Number }, // in grams
    fabricType: { type: String },
    fitType: {
        type: String,
        enum: ['Regular', 'Slim', 'Relaxed', 'Skinny', 'Wide Leg']
    },

    targetAudience: {
        type: String,
        enum: ['Women', 'Men', 'Kids'], // Changed 'Male' to 'Men'
        required: true
      },
      
    category: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending Approval', 'Active', 'Out of Stock'],
        default: 'Pending Approval'
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
        },
}, { timestamps: true });

// 🔁 Pre-save hook to auto-calculate price
productSchema.pre('save', function (next) {
    if (this.isModified('originalPrice') || this.isModified('discount')) {
        this.price = Math.round(this.originalPrice * (1 - this.discount / 100));
    }
    next();
});

// Text index for search
productSchema.index({
    name: 'text',
    category: 'text'
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
