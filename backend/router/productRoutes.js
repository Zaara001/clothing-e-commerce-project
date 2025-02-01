const express = require('express');
const Product = require('../model/productModel');
const VerifySeller = require('../middleware/sellerAuthMiddleware');
const { upload } = require('../utils/cloudinaryConfig'); // Multer-Cloudinary config
const router = express.Router();

// POST: Create a new product (Pending Approval)
router.post('/seller/addProduct', VerifySeller, upload.array('images', 5), async (req, res) => {
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
        sku
    } = req.body;

    if (!name || !description || !material || !price || !shippingCost || !quantity || !sku) {
        return res.status(400).json({ message: "Missing required product fields." });
    }

    try {
        const imageUrls = req.files.map(file => file.path); // Store Cloudinary image URLs

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
            seller: req.Sellers.id,  // Link product to seller
            status: "Pending Approval",
        });

        await product.save();
        res.status(201).json({ message: "Product added successfully. Awaiting admin approval.", product });
    } catch (err) {
        res.status(500).json({ message: "Error adding product.", error: err.message });
    }
});

// GET: Get all products added by the seller
router.get('/seller/viewProduct', VerifySeller, async (req, res) => {
    try {
        const products = await Product.find({ seller: req.Sellers.id });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: "Error fetching products.", error: err.message });
    }
});

// GET: Get details of a specific product
router.get('/seller/productDetails/:name', VerifySeller, async (req, res) => {
    try {
        // Use req.params.name to search for the product
        const productName = req.params.name;
        // Find all products that match the given name for the seller
        const products = await Product.find({ name: productName, seller: req.Sellers.id });

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: "Error fetching product.", error: err.message });
    }
});


// PATCH: Update a product by the seller (Including Image Deletion and Update)
router.patch('/seller/updateProduct/:name', VerifySeller, upload.array('images', 5), async (req, res) => {
    try {
        // Find the product by name and seller
        const product = await Product.findOne({ name: req.params.name, seller: req.Sellers.id });

        if (!product) {
            return res.status(404).json({ message: "Product not found or you're not authorized." });
        }

        // Ensure images is always an array, even if not updated
        let imageUrls = Array.isArray(product.images) ? [...product.images] : [];

        // Remove the image URL to delete (if provided)
        if (req.body.imageToDelete) {
            imageUrls = imageUrls.filter(image => image !== req.body.imageToDelete);
        }

        // Add new images (if uploaded)
        if (req.files && req.files.length > 0) {
            const newImageUrls = req.files.map(file => file.path); // New images
            imageUrls = [...imageUrls, ...newImageUrls]; // Add new images to the existing ones
        }

        // Update only the provided fields, including images
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
            images: imageUrls, // Updated images
            quantity: req.body.quantity || product.quantity,
            sku: req.body.sku || product.sku,
        };

        // Use findOneAndUpdate for updating the product by name
        const updatedProduct = await Product.findOneAndUpdate(
            { name: req.params.name, seller: req.Sellers.id }, // query by name and seller
            updatedFields, 
            { new: true } // return the updated product
        );

        res.status(200).json({ message: "Product updated successfully.", updatedProduct });

    } catch (err) {
        res.status(500).json({ message: "Error updating product.", error: err.message });
    }
});

module.exports = router;
