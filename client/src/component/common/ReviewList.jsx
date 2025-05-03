import React from "react";

const ReviewList = ({ reviews }) => {
  if (!reviews.length) {
    return <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review, i) => (
        <div key={i} className="border-b pb-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-yellow-500">
              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
            </span>
            <span className="font-medium">{review.userName || "Anonymous"}</span>
            <span className="text-gray-500 text-sm">
            {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-700">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;