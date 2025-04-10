import React from "react";

const StatusBadge = ({ status }) => {
  const isAvailable = status === "Available";

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full font-medium ${
        isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
