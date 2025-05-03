const express = require("express");
const passport = require("passport");
const Seller = require("../model/sellerSchema");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateJwt");
const verifyToken = require("../middleware/authMiddleware");
const Order = require('../model/orderModel'); // adjust the path if necessary
const {
  updateOrderStatus
} = require('../controller/sellerController');
const mongoose = require('mongoose');
const Product = require('../model/productModel');



const router = express.Router();

// Google OAuth for Sellers
router.get(
  "/auth/google/seller",
  passport.authenticate("google-seller", {
    scope: ["profile", "email"],
    prompt: "select_account consent",
  })
);

// Google OAuth Callback for Sellers
router.get(
  "/auth/google/callback/seller",
  passport.authenticate("google-seller", { failureRedirect: "/login", session: false }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const { email } = req.user;

    try {
      const seller = await Seller.findOne({ email });

      if (seller && seller.isProfileComplete) {
        const accessToken = generateAccessToken(seller);
        const refreshToken = generateRefreshToken(seller);

        res.cookie("accessToken", accessToken, {  httpOnly: true,
           secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 1000 });
        res.cookie("refreshToken", refreshToken, { httpOnly: true,
           secure: process.env.NODE_ENV === "production",
           sameSite: "strict",
           maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
          }); 

        res.redirect("http://localhost:5173/seller/dashboard");
      } else {
        const accessToken = generateAccessToken(req.user);
        const refreshToken = generateRefreshToken(req.user);

        res.cookie("accessToken", accessToken, {  httpOnly: true,
          secure: process.env.NODE_ENV === "production",
         sameSite: "strict",
         maxAge: 60 * 60 * 1000 });
       res.cookie("refreshToken", refreshToken, { httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
         }); 
        res.redirect(`http://localhost:5173/seller/register?email=${encodeURIComponent(email)}`);
      }
    } catch (error) {
      console.error("Error in Google callback:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Seller Registration Endpoint
router.post("/register", async (req, res) => {
  const { email, businessName, gstNumber, bankDetails } = req.body;

  try {
    const seller = await Seller.findOneAndUpdate(
      { email: { $regex: new RegExp(`^${email}$`, "i") } },
      { businessName, gstNumber, bankDetails, isProfileComplete: true },
      { new: true, upsert: true }
    );

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json({ message: "Seller profile updated successfully", seller });
  } catch (error) {
    console.error("Error updating seller profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get current seller
router.get("/me", verifyToken, async (req, res) => {
  try {
    console.log("Authenticated user from token:", req.user);

    const seller = await Seller.findById(req.user._id);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json({ seller });
  } catch (error) {
    console.error("Error fetching seller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Seller Orders Route
router.get("/orders", verifyToken, async (req, res) => {
  try {
    const sellerId = req.user._id;

    // Fetch orders where seller's products are involved
    const orders = await Order.find({ "orderItems.sellerId": sellerId })
      .populate("orderItems.productId", "title image price") // populate only needed product info
      .populate("shippingAddress")
      .sort({ createdAt: -1 }); // newest first

    // Now filter the orderItems for each order
    const filteredOrders = orders.map(order => {
      const sellerItems = order.orderItems.filter(item => 
        item.sellerId.toString() === sellerId.toString()
      );

      return {
        _id: order._id,
        user: order.user,
        orderItems: sellerItems,
        shippingAddress: order.shippingAddress,
        paymentInfo: order.paymentInfo,
        totalAmount: order.totalAmount,
        isPaid: order.isPaid,
        paidAt: order.paidAt,
        createdAt: order.createdAt,
      };
    });

    if (filteredOrders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json({ orders: filteredOrders });
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update order status
router.post('/order/status', verifyToken, updateOrderStatus);



// ✅ Logout Route
router.get("/logout", (req, res) => {
  res.clearCookie("accessToken", { sameSite: "Lax", httpOnly: true });
  res.clearCookie("refreshToken", { sameSite: "Lax", httpOnly: true });
  res.status(200).json({ message: "Logged out successfully" });
});



// sellerRoutes.js

router.get('/analytics/summary', verifyToken, async (req, res) => {
  try {
    const sellerId = req.user._id;
    const today = new Date();
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    // Get all successful orders for this seller
    const allOrders = await Order.find({
      'orderItems.sellerId': sellerId,
      status: { $ne: 'Cancelled' }
    }).sort({ createdAt: 1 }).populate('user', '_id');

    // Find first purchase date for each customer
    const customerFirstPurchase = new Map();
    allOrders.forEach(order => {
      const userId = order.user._id.toString();
      if (!customerFirstPurchase.has(userId)) {
        customerFirstPurchase.set(userId, order.createdAt);
      }
    });

    // Filter current and last month orders
    const currentMonthOrders = allOrders.filter(order => 
      order.createdAt >= currentMonthStart
    );
    
    const lastMonthOrders = allOrders.filter(order => 
      order.createdAt >= lastMonthStart && 
      order.createdAt < currentMonthStart
    );

    // Calculate new vs repeat customers
    let newCustomers = 0;
    let repeatCustomers = 0;
    
    const currentMonthCustomerIds = new Set();
    
    currentMonthOrders.forEach(order => {
      const userId = order.user._id.toString();
      if (currentMonthCustomerIds.has(userId)) return; // Skip duplicates
      
      currentMonthCustomerIds.add(userId);
      
      if (customerFirstPurchase.get(userId) >= currentMonthStart) {
        newCustomers++;
      } else {
        repeatCustomers++;
      }
    });

    // Calculate metrics
    const currentRevenue = currentMonthOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const currentOrders = currentMonthOrders.length;
    const avgOrderValue = currentOrders > 0 ? currentRevenue / currentOrders : 0;

    res.json({
      revenue: currentRevenue,
      revenueChange: "+0%", // Implement proper comparison if needed
      orders: currentOrders,
      ordersChange: "+0%",  // Implement proper comparison if needed
      successfulOrders: currentMonthOrders.filter(o => o.status === 'Delivered').length,
      avgOrderValue: Math.round(avgOrderValue),
      newCustomers,
      repeatCustomers,
      newCustomersChange: "+0%",
      repeatCustomersChange: "+0%"
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/analytics/bestsellers', verifyToken, async (req, res) => {
  try {
    const sellerId = new mongoose.Types.ObjectId(req.user._id);

    const bestsellers = await Order.aggregate([
      {
        $match: {
          'orderItems.sellerId': sellerId,
          status: { $nin: ['Cancelled', 'Returned'] }
        }
      },
      { $unwind: '$orderItems' },
      { $match: { 'orderItems.sellerId': sellerId } },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.productId',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: '$orderItems.productId',
          name: { $first: '$productDetails.name' },
          price: { $first: '$productDetails.price' },
          sold: { $sum: '$orderItems.quantity' },
          revenue: {
            $sum: {
              $multiply: ['$orderItems.priceAtPurchase', '$orderItems.quantity']
            }
          }
        }
      },
      { $sort: { sold: -1 } },
      { $limit: 5 }
    ]);

    res.json(bestsellers.map(item => ({
      ...item,
      price: item.price, // Keep as number for formatting in frontend
      revenue: item.revenue
    })));

  } catch (error) {
    console.error('Bestsellers error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


router.get('/analytics/recent-orders', verifyToken, async (req, res) => {
  try {
    const sellerId = new mongoose.Types.ObjectId(req.user._id);

    const orders = await Order.aggregate([
      {
        $match: {
          'orderItems.sellerId': sellerId,
          status: { $nin: ['Cancelled'] }
        }
      },
      { $sort: { createdAt: -1 } },
      { $limit: 10 },
      { $unwind: '$orderItems' },
      { $match: { 'orderItems.sellerId': sellerId } },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.productId',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: '$_id',
          createdAt: { $first: '$createdAt' },
          status: { $first: '$status' },
          totalAmount: { $first: '$totalAmount' },
          orderItems: {
            $push: {
              // Use title from order first, fallback to product name
              name: { $ifNull: ['$orderItems.title', '$productDetails.name'] },
              quantity: '$orderItems.quantity',
              price: '$orderItems.priceAtPurchase'
            }
          }
        }
      }
    ]);

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/analytics/sales-trend', verifyToken, async (req, res) => {
  try {
    const sellerId = new mongoose.Types.ObjectId(req.user._id);
    const months = 6; // Get data for last 6 months
    
    // Generate month labels correctly
    const monthLabels = [];
    const currentDate = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(currentDate.getMonth() - i);
      monthLabels.push(date.toLocaleString('default', { month: 'short' }));
    }

    // Get start date correctly (6 months back)
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    startDate.setDate(1);

    // Aggregation pipeline
    const salesData = await Order.aggregate([
      {
        $match: {
          'orderItems.sellerId': sellerId,
          createdAt: { $gte: startDate },
          status: { $nin: ['Cancelled', 'Returned'] }
        }
      },
      { $unwind: '$orderItems' },
      { $match: { 'orderItems.sellerId': sellerId } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalSales: { 
            $sum: { 
              $multiply: [
                '$orderItems.priceAtPurchase', 
                '$orderItems.quantity'
              ] 
            } 
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Initialize monthly sales with zeros
    const monthlySales = Array(months).fill(0);
    
    // Calculate current month index
    const currentMonth = new Date().getMonth();
    
    // Fill sales data
    salesData.forEach(sale => {
      const monthDiff = (currentMonth - sale._id.month + 1) + (12 * (new Date().getFullYear() - sale._id.year));
      const index = months - monthDiff - 1;
      if (index >= 0 && index < months) {
        monthlySales[index] = sale.totalSales / 100; // Convert to currency
      }
    });

    res.status(200).json({
      months: monthLabels,
      revenue: monthlySales
    });
    
  } catch (error) {
    console.error('Error fetching sales trend:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
module.exports = router;