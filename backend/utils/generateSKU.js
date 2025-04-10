// utils/generateSKU.js
const generateSKU = (product) => {
    const brandCode = "AUR"; // You can customize this
    const audienceCode = product.targetAudience?.slice(0, 3).toUpperCase() || "GEN";
    const categoryCode = product.category?.slice(0, 3).toUpperCase() || "CAT";
    const randomCode = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  
    return `${brandCode}-${audienceCode}-${categoryCode}-${randomCode}`;
  };
  
  module.exports = generateSKU;
  