import React, { useState } from "react";

const ReviewForm = ({ onSubmit, disabled }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !comment) return;
    onSubmit({ rating, comment, date: new Date().toISOString() });
    setRating(0);
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2">
        <span>Your Rating:</span>
        <div className="flex">
          {[1,2,3,4,5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="review-comment" className="block mb-1 font-medium">Review</label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border p-2 rounded h-24"
          placeholder="Share your experience with this product"
          disabled={disabled}
        />
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;