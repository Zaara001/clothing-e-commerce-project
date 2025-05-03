const Order = require('../model/orderModel');
const Product = require('../model/productModel');
const { sendOrderConfirmationEmail } = require('../services/emailService');  // Changed to require

exports.createOrder = async (req, res) => {
  try {
    const {
      paymentId,
      orderId,
      signature,
      amount,
      items,
      addressId,
      deliveryCharge,         
      deliveryChargePaid,
      address,   
    } = req.body;

    // --- Validations ---
    if (!paymentId) {
      return res.status(400).json({ success: false, message: 'Payment ID is required' });
    }
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order ID is required' });
    }
    if (!signature) {
      return res.status(400).json({ success: false, message: 'Signature is required' });
    }
    const totalAmount = Number(amount);
    if (isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one order item is required' });
    }
    if (!addressId) {
      return res.status(400).json({ success: false, message: 'Address ID is required' });
    }

    // --- Validate items ---
const invalidItems = items.filter(item => 
  !item._id || 
  !item.name || 
  !item.quantity || 
  isNaN(item.price) ||
  !item.selectedSize ||  // Validate selectedSize
  !item.selectedColor    // Validate selectedColor
);
if (invalidItems.length > 0) {
  return res.status(400).json({ success: false, message: 'Invalid items in order' });
}


    // --- Fetch sellerId for each item ---
    const orderItems = await Promise.all(items.map(async (item) => {
      const product = await Product.findById(item._id).select('seller');
      if (!product) {
        throw new Error(`Product with ID ${item._id} not found`);
      }

      // Save selectedSize and selectedColor from cart to order
      return {
        productId: item._id,
        sellerId: product.seller,
        name: item.name,
        quantity: item.quantity,
        priceAtPurchase: item.price,
        image: item.image || 'default-product-image.jpg',
        selectedSize: item.selectedSize,   // 🆕 Added selectedSize
        selectedColor: item.selectedColor, // 🆕 Added selectedColor
      };
    }));

    // --- Create Order ---
    const newOrder = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress: addressId,
      paymentInfo: {
        paymentId,
        orderId,
        signature,
        method: 'Razorpay'
      },
      totalAmount,
      deliveryCharge: deliveryCharge || 0,
      deliveryChargePaid: deliveryChargePaid || false,
      isPaid: true,
      paidAt: new Date()
    });

    const savedOrder = await newOrder.save();

    // --- Update Product Quantities ---
    await Promise.all(orderItems.map(async (item) => {
      const product = await Product.findById(item.productId);
      if (product) {
        product.quantity -= item.quantity;
        if (product.quantity < 0) product.quantity = 0;
        if (product.quantity === 0) product.status = "Out Of Stock";
        await product.save();
      }
    }));

    // --- Send Confirmation Email ---
    const orderSummary = {
      paymentId: savedOrder.paymentInfo.paymentId,
      amount: savedOrder.totalAmount,
      items: savedOrder.orderItems,
      address: address, 
      user: {
        name: req.user.name,
        email: req.user.email,
      },
    };

    try {
      await sendOrderConfirmationEmail(req.user.email, orderSummary);
    } catch (emailError) {
      console.error('Email failed, but order was saved:', emailError);
    }

    return res.status(201).json({ success: true, order: savedOrder });

  } catch (err) {
    console.error('Create Order Error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }) 
      .populate('orderItems.productId', 'title image') 
      .populate('shippingAddress') // ✅ This should fetch full address details
      .exec();

    console.log("🚀 Orders fetched from DB:", JSON.stringify(orders, null, 2)); // 🔴 Debugging line

    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: 'No orders found' });
    }

    return res.status(200).json({ success: true, orders });

  } catch (err) {
    console.error('Get Orders Error:', err);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

