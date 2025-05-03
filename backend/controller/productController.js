const Product = require('../model/productModel');

const getProductsByCategory = async (req, res) => {
  try {
    const { targetAudience, category } = req.params;
    
    const normalizeInput = (input) => {
      return input
        .toLowerCase()
        .replace(/-/g, ' ')
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim();
    };
    
    const normalizedAudience = normalizeInput(targetAudience);
    const normalizedCategory = normalizeInput(category);

    const products = await Product.find({
      $and: [
        { 
          targetAudience: { 
            $regex: new RegExp(`^${normalizedAudience}$`, 'i') 
          } 
        },
        { 
          category: { 
            $regex: new RegExp(`^${normalizedCategory}$`, 'i') 
          } 
        },
        { status: 'Active' }
      ]
    }).select('-__v'); // Exclude version key

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active products found in this category',
        searchParams: {
          targetAudience: normalizedAudience,
          category: normalizedCategory
        },
        suggestion: 'Check spelling or try broader categories'
      });
    }

    res.json({
      success: true,
      count: products.length,
      data: products
    });

  } catch (error) {
    console.error('Server Error:', {
      params: req.params,
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};



const searchProductsController = async (req, res) => {
  try {
    const { keyword = '', category, minPrice, maxPrice, sort } = req.query;

    let query = {
      name: { $regex: keyword, $options: 'i' },
      status: "Active"
    };

    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = {};
    switch (sort) {
      case 'priceLowToHigh':
        sortOption.price = 1;
        break;
      case 'priceHighToLow':
        sortOption.price = -1;
        break;
      case 'latest':
        sortOption.createdAt = -1;
        break;
      default:
        sortOption._id = -1;
    }

    const products = await Product.find(query).sort(sortOption);
    res.status(200).json(products);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error("Error getting product:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getProductsByCategory,
  searchProductsController,
  getProductById, // 👈 add this
};


