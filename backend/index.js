require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser'); 
const cloudinary = require('cloudinary').v2;

require('./middleware/Passport');

const authRoutes = require('./router/authRoutes');
const sellerRoutes = require('./router/sellerRoutes');
const profileRoutes = require('./router/profileRoutes'); 
const productRoutes = require('./router/productRoutes') // ✅ Import profile routes

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser()); 

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, sameSite: "Lax" },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ Properly Mount Routes
app.use( authRoutes);        // User authentication routes
app.use("/seller", sellerRoutes);    // Seller authentication routes
app.use("/profile", profileRoutes); 
app.use("/product", productRoutes) // Profile route

// ✅ Debug: Show loaded routes
console.log("Loaded Routes:", app._router.stack
  .filter((r) => r.route)
  .map((r) => r.route.path)
);

// MongoDB Connection
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('error', (err) => console.log("DB Error:", err));
mongoose.connection.once('open', () => console.log("Database connected"));

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
