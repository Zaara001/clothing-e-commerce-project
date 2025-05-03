const express = require("express");
const { addReview, getReviewsByProduct } = require("../controller/reviewController");
const verifyToken = require("../middleware/authMiddleware"); // ✅ Your file

const router = express.Router();

// GET: Fetch reviews (Public)
router.get("/:productId", getReviewsByProduct);

// POST: Add review (Protected)
router.post("/:productId", verifyToken, addReview);

module.exports = router;
