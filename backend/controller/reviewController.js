const Review = require('../model/reviewModel')

// POST: Add a review
const addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { productId } = req.params;

  if (!rating || !comment) {
    return res.status(400).json({ message: "Rating and comment are required" });
  }

  try {
    const existingReview = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    const newReview = new Review({
      product: productId,
      user: req.user._id,
      rating,
      comment,
      userName: req.user.name, // req.user is available from verifyToken
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Add Review Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET: All reviews by product ID
const getReviewsByProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Fetch Reviews Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { addReview, getReviewsByProduct };
