const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../model/userModel");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateJwt");
const verifyToken = require("../middleware/authMiddleware");
const Product = require("../model/productModel");
const mongoose = require("mongoose");


const router = express.Router();

// ✅ Register User
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    res.cookie("accessToken", accessToken, {  httpOnly: true,
      secure: process.env.NODE_ENV === "production",
     sameSite: "strict",
     maxAge: 60 * 60 * 1000 });
   res.cookie("refreshToken", refreshToken, { httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
     }); 

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        cart: newUser.cart || [] // Initialize the cart if not set
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt for:", email);

  try {
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    console.log("Tokens generated for user:", user.email);

    // 4. Set cookies
    res.cookie("accessToken", accessToken, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000 // 1 hour (matches token expiration)
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    console.log("Cookies set successfully");

    // 5. Send response with cart data
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        cart: user.cart || [] // Send cart data with the login response
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "Login failed",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
});

// ✅ Google OAuth Start
router.get(
  "/auth/google",
  passport.authenticate("google-user", {
    scope: ["profile", "email"],
    prompt: "select_account consent",
  })
);

// ✅ Google OAuth Callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google-user", { failureRedirect: "/login", session: false }),
  async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Authentication failed" });

    const accessToken = generateAccessToken(req.user);
    const refreshToken = generateRefreshToken(req.user);
    res.cookie("accessToken", accessToken, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000 // 1 hour (matches token expiration)
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // ✅ Redirect to frontend
    res.redirect("http://localhost:5173/");
  }
);

// ✅ Refresh Token
router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(403).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a new access token
    const accessToken = generateAccessToken(user);

   
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict", 
      maxAge: 60 * 60 * 1000, 
    });

    
    return res.json({
      message: "Token refreshed successfully",
      accessToken,
    });
  } catch (error) {
    console.error("Refresh Error:", error);
    return res.status(403).json({ message: "Invalid refresh token" });
  }
});

// ✅ Logout
router.get("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
});

// Add this to your backend routes
router.get('/cart', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.productId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cartItems = user.cart.map(item => ({
      productId: item.productId.toObject(),
      quantity: item.quantity,
      selectedColor: item.selectedColor,  // Include selected color
      selectedSize: item.selectedSize     // Include selected size
    }));

    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart' });
  }
});


router.post('/cart/add', verifyToken, async (req, res) => {
  const { productId, quantity, selectedColor, selectedSize } = req.body;  // Get selectedColor and selectedSize
  const qty = parseInt(quantity ?? '1', 10);
  const userId = req.user._id;

  // Validate productId format
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid product ID format' });
  }

  // Validate quantity
  if (isNaN(qty) || qty < 1) {
    return res.status(400).json({ message: 'Quantity must be a positive integer' });
  }

  // Validate selectedColor and selectedSize
  if (!selectedColor || !selectedSize) {
    return res.status(400).json({ message: 'Color and Size are required' });
  }

  try {
    const productObjectId = new mongoose.Types.ObjectId(productId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const product = await Product.findById(productObjectId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if item exists, update or add
    const existingIndex = user.cart.findIndex(item =>
      item.productId.equals(productObjectId) &&
      item.selectedColor === selectedColor &&  // Check if the color is the same
      item.selectedSize === selectedSize       // Check if the size is the same
    );

    if (existingIndex >= 0) {
      user.cart[existingIndex].quantity += qty;  // Update quantity if already in the cart
    } else {
      user.cart.push({ 
        productId: productObjectId, 
        quantity: qty, 
        selectedColor,      // Store selected color
        selectedSize       // Store selected size
      });
    }

    await user.save();

    // Populate for response
    const updatedUser = await User.findById(userId).populate('cart.productId');
    const updatedItem = updatedUser.cart.find(item =>
      item.productId._id.equals(productObjectId)
    );

    res.status(200).json({
      message: 'Product added to cart',
      product: {
        ...updatedItem.productId.toObject(),
        quantity: updatedItem.quantity,
        selectedColor: updatedItem.selectedColor,  // Include selected color
        selectedSize: updatedItem.selectedSize     // Include selected size
      }
    });
  } catch (error) {
    console.error('Cart add error:', error);
    res.status(500).json({ message: 'Error adding to cart' });
  }
});


// POST /cart/remove - remove a product from the cart
router.post('/cart/remove', verifyToken, async (req, res) => {
  const { productId, selectedColor, selectedSize } = req.body;  // Get selectedColor and selectedSize
  const userId = req.user._id;

  // Validate productId format
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid product ID format' });
  }

  try {
    const productObjectId = new mongoose.Types.ObjectId(productId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter out the item based on productId, selectedColor, and selectedSize
    user.cart = user.cart.filter(item =>
      !(item.productId.equals(productObjectId) &&
        item.selectedColor === selectedColor && 
        item.selectedSize === selectedSize)
    );

    await user.save();

    // Populate remaining items for response
    const updatedUser = await User.findById(userId).populate('cart.productId');
    const cartItems = updatedUser.cart.map(item => ({
      ...item.productId.toObject(),
      quantity: item.quantity,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize
    }));

    res.status(200).json(cartItems); 
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Error removing from cart' });
  }
});

router.put('/cart/update', verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    // Validate input presence
    if (!productId || quantity == null) {
      return res.status(400).json({ message: 'productId and quantity are required' });
    }
    // Validate productId format (24-char hex)
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(productId)) {
      return res.status(400).json({ message: 'Invalid productId format' });
    }
    // Validate quantity is a positive integer
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be a positive integer' });
    }

    // Find the user by ID (req.user set by verifyToken)
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the cart item
    const cartItem = user.cart.find(item => 
      item.productId.toString() === productId
    );
    if (!cartItem) {
      // Product not in cart – cannot update
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Update quantity
    cartItem.quantity = quantity;

    // Save updated user (and cart)
    await user.save();

    // Populate product details for each cart item
    await user.populate('cart.productId');

    // Return updated cart array
    return res.json(user.cart);
  } catch (err) {
    console.error('Error updating cart:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/cart/clear', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Clear cart
    user.cart = [];
    await user.save();

    res.status(200).json({ message: 'Cart cleared', cart: user.cart });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Error clearing cart' });
  }
});


// ✅ Profile route
router.get("/profile", verifyToken, async (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      cart: req.user.cart || [] // Include cart info in profile response
    },
  });
});

module.exports = router;
