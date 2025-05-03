const mongoose = require('mongoose');
const Order = require('../model/orderModel');
const Product = require('../model/productModel');

exports.getSimilarProducts = async (req, res) => {
    try {
      const { productId } = req.params;
  
      // 1. Validate and get current product
      const currentProduct = await Product.findById(productId).lean();
      if (!currentProduct) {
        return res.status(404).json({ 
          success: false, 
          message: 'Product not found' 
        });
      }
  
      // 2. Build base query (same category + audience)
      const baseQuery = {
        _id: { $ne: currentProduct._id },
        category: currentProduct.category,
        targetAudience: currentProduct.targetAudience,
        status: 'Active'
      };
  
      // 3. Try strict matching first (color + material)
      let similarProducts = await Product.find({
        ...baseQuery,
        colorOptions: { $in: currentProduct.colorOptions },
        material: currentProduct.material
      }).limit(5);
  
      // 4. Fallback to color-only matching
      if (similarProducts.length < 5) {
        const colorOnlyProducts = await Product.find({
          ...baseQuery,
          colorOptions: { $in: currentProduct.colorOptions }
        })
        .limit(5 - similarProducts.length);
        similarProducts = [...similarProducts, ...colorOnlyProducts];
      }
  
      // 5. Final fallback to category-only
      if (similarProducts.length < 5) {
        const categoryOnlyProducts = await Product.find({
          ...baseQuery,
        })
        .limit(5 - similarProducts.length);
        similarProducts = [...similarProducts, ...categoryOnlyProducts];
      }
  
      res.status(200).json({
        success: true,
        data: similarProducts
      });
  
    } catch (err) {
      console.error('Recommendation Error:', err);
      res.status(500).json({ 
        success: false, 
        message: 'Server error'
      });
    }
  };



  exports.getFrequentlyBoughtTogether = async (req, res) => {
    try {
      const { productId } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ success: false, message: 'Invalid product ID' });
      }
  
      const targetProductId = new mongoose.Types.ObjectId(productId);
  
      // Corrected aggregation pipeline
      const frequentProducts = await Order.aggregate([
        {
          $match: {
            "orderItems.productId": targetProductId,
            status: { $nin: ["Cancelled"] }
          }
        },
        { $unwind: "$orderItems" },
        {
          $match: {
            "orderItems.productId": { $ne: targetProductId }
          }
        },
        {
          $group: {
            _id: "$orderItems.productId",
            count: { $sum: 1 },
            lastOrder: { $max: "$createdAt" }
          }
        },
        { $sort: { count: -1, lastOrder: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "productDetails"
          }
        },
        { $unwind: "$productDetails" },
        {
          $match: {
            "productDetails.status": "Active"
          }
        },
        {
          $project: {
            _id: 1,
            name: "$productDetails.name",
            price: "$productDetails.price",
            images: "$productDetails.images",
            colorOptions: "$productDetails.colorOptions",
            frequentCount: "$count"
          }
        }
      ]);
  
      res.status(200).json({ success: true, data: frequentProducts });
    } catch (err) {
      console.error('Frequent Products Error:', err);
      res.status(500).json({ 
        success: false, 
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  };
  
  // In productController.js

  exports.getTrendingProducts = async (req, res) => {
    try {
      const products = await Product.aggregate([
        { $match: { status: "Active" } },
        { $sample: { size: 5} },
        { $project: { 
          name: 1, 
          brandName:1,
          price: 1, 
          originalPrice: 1,  // Add this
          discount: 1,       // Add this
          images: 1, 
          colorOptions: 1,
          category: 1,
          targetAudience: 1
        }}
      ]);
  
      res.status(200).json({ success: true, data: products });
    } catch (err) {
      console.error('Trending Products Error:', err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };