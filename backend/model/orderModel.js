const mongoose = require('mongoose');
const { Schema } = mongoose;

// Sub-schema for each order item
const orderItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: 'Seller',
    required: true,
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  priceAtPurchase: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  selectedSize: { type: String, required: true },   // ✅ new
  selectedColor: { type: String, required: true },  // ✅ new
}, { _id: false });

// Sub-schema for payment information
const paymentInfoSchema = new Schema({
  paymentId: { type: String, required: true },
  orderId: { type: String, required: true },
  signature: { type: String, required: true },
  method: { type: String, default: 'Razorpay' },
}, { _id: false });

// Main Order schema
const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    type: Schema.Types.ObjectId,
    ref: 'Address',
    required: true,
  },
  paymentInfo: paymentInfoSchema,
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  deliveryCharge: {
    type: Number,
    required: true,
    default: 0,
  },
  deliveryChargePaid: {
    type: Boolean,
    required: true,
    default: false,
  },
  status: {
    type: String,
    enum: ["Pending", "Shipping", "Cancelled", "Delivered"],
    default: "Pending",
  },
  
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});

module.exports = mongoose.model('Order', orderSchema);