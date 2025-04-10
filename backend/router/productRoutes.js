const express = require('express');
const Product = require('../model/productModel');
const { upload } = require('../utils/cloudinaryConfig');
const verifyToken = require('../middleware/authMiddleware');
const generateSKU = require('../utils/generateSKU');
const router = express.Router();

// Add Product
router.post('/seller/addProduct', verifyToken, upload.array('images', 5), async (req, res) => {
    const {
        name,
        description,
        material,
        sizeOptions,
        colorOptions,
        careInstructions,
        brandName,
        price,
        discount,
        shippingCost,
        quantity,
        targetAudience,
        category
    } = req.body;

    if (!name || !description || !material || !price || !shippingCost || !quantity || !targetAudience || !category) {
        return res.status(400).json({ message: "Missing required product fields." });
    }

    try {
        // 🔄 Generate Unique SKU
        let sku;
        let isUnique = false;
        while (!isUnique) {
            sku = generateSKU({ targetAudience, category });
            const existing = await Product.findOne({ sku });
            if (!existing) isUnique = true;
        }

        const imageUrls = req.files.map(file => file.path);

        const product = new Product({
            name,
            description,
            material,
            sizeOptions: sizeOptions?.split(','),
            colorOptions: colorOptions?.split(','),
            careInstructions,
            brandName,
            price,
            discount,
            shippingCost,
            images: imageUrls,
            quantity,
            sku,
            targetAudience,
            category,
            seller: req.user._id,
            status: "Pending Approval",
        });

        await product.save();
        res.status(201).json({ message: "Product added successfully. Awaiting admin approval.", product });
    } catch (err) {
        res.status(500).json({ message: "Error adding product.", error: err.message });
    }
});

// View All Products
router.get('/seller/viewProduct', verifyToken, async (req, res) => {
    try {
        const products = await Product.find({ seller: req.user._id });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: "Error fetching products.", error: err.message });
    }
});

// View Product Details by Name
router.get('/seller/productDetails/:name', verifyToken, async (req, res) => {
    try {
        const productName = req.params.name;
        const products = await Product.find({ name: productName, seller: req.user._id });

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: "Error fetching product.", error: err.message });
    }
});

// Update Product
router.patch('/seller/updateProduct/:name', verifyToken, upload.array('images', 5), async (req, res) => {
    try {
        const product = await Product.findOne({ name: req.params.name, seller: req.user._id });

        if (!product) {
            return res.status(404).json({ message: "Product not found or you're not authorized." });
        }

        let imageUrls = Array.isArray(product.images) ? [...product.images] : [];

        if (req.body.imageToDelete) {
            imageUrls = imageUrls.filter(image => image !== req.body.imageToDelete);
        }

        if (req.files && req.files.length > 0) {
            const newImageUrls = req.files.map(file => file.path);
            imageUrls = [...imageUrls, ...newImageUrls];
        }

        const updatedFields = {
            name: req.body.name || product.name,
            description: req.body.description || product.description,
            material: req.body.material || product.material,
            sizeOptions: req.body.sizeOptions ? req.body.sizeOptions.split(',') : product.sizeOptions,
            colorOptions: req.body.colorOptions ? req.body.colorOptions.split(',') : product.colorOptions,
            careInstructions: req.body.careInstructions || product.careInstructions,
            brandName: req.body.brandName || product.brandName,
            price: req.body.price || product.price,
            discount: req.body.discount || product.discount,
            shippingCost: req.body.shippingCost || product.shippingCost,
            images: imageUrls,
            quantity: req.body.quantity || product.quantity,
            sku: req.body.sku || product.sku,
            targetAudience: req.body.targetAudience || product.targetAudience,
            category: req.body.category || product.category
        };

        const updatedProduct = await Product.findOneAndUpdate(
            { name: req.params.name, seller: req.user._id },
            updatedFields,
            { new: true }
        );

        res.status(200).json({ message: "Product updated successfully.", updatedProduct });

    } catch (err) {
        res.status(500).json({ message: "Error updating product.", error: err.message });
    }
});

// View All Approved Products (Public)
router.get('/all', async (req, res) => {
    try {
        const products = await Product.find({ status: "Active" });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: "Error fetching products.", error: err.message });
    }
});

// View One Public Product
router.get("/getOne", async (req, res) => {
    try {
        const product = await Product.findOne({ status: "Active" });
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: "Error fetching product.", error: err.message });
    }
});

// Get one product by ID (public route)
router.get("/getOne/:id", async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product || product.status !== "Active") {
        return res.status(404).json({ message: "Product not found." });
      }
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ message: "Error fetching product.", error: err.message });
    }
  });

  // ✅ Get Products by Category (Public Route)
router.get("/category/:categoryName", async (req, res) => {
    const { categoryName } = req.params;

    try {
        const products = await Product.find({
            category: categoryName,
            status: "Active", // only show approved/active products
        });

        res.status(200).json({ products });
    } catch (err) {
        res.status(500).json({ message: "Error fetching category products", error: err.message });
    }
});

module.exports = router;
