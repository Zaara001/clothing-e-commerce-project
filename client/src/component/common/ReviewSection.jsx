// client/src/component/common/ReviewSection.jsx
import React, { useState } from "react";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";
import axios from "axios";

const ReviewSection = ({ productId, initialReviews }) => {
  const [reviews, setReviews] = useState(initialReviews || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddReview = async (reviewData) => {
    console.log("Submitting review with data:", reviewData);
    console.log("Product ID:", productId);
    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `/reviews/${productId}`,
        reviewData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log("Review submitted successfully:", res.data);
      setReviews((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("Full error object:", err);
      console.error("Error response data:", err.response?.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <ReviewList reviews={reviews} />
      <ReviewForm onSubmit={handleAddReview} disabled={isSubmitting} />
    </div>
  );
};

export default ReviewSection;
