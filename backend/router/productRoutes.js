const express = require('express');
const Product = require('../model/productModel');
const { upload } = require('../utils/cloudinaryConfig');
const verifyToken = require('../middleware/authMiddleware');
const generateSKU = require('../utils/generateSKU');
const router = express.Router();
const { getProductsByCategory, searchProductsController, getProductById } = require('../controller/productController');
const { getSimilarProducts, getFrequentlyBoughtTogether, getTrendingProducts } = require('../controller/recommendationController');

// Add Product
router.post('/seller/addProduct', verifyToken, upload.array('images', 5), async (req, res) => {
    const requestBody = { ...req.body };
    try {
        delete requestBody.images; // Remove sensitive data from logs
        
        // Destructure fields
        const { name, description, material, sizeOptions, colorOptions, careInstructions,
            brandName, originalPrice, discount, shippingCost, quantity, targetAudience,
            category, transparency, occasions, countryOfOrigin, manufactureDetails,
            itemWeight, fabricType, fitType } = req.body;

        // Validate required fields
        const requiredFields = ['name', 'description', 'material', 'originalPrice', 
            'shippingCost', 'quantity', 'targetAudience', 'category'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            console.error('Missing fields:', missingFields);
            return res.status(400).json({ 
                message: "Missing required fields",
                missingFields 
            });
        }

        // Validate numerical values
        const numericValidations = [
            { field: 'originalPrice', value: originalPrice, min: 0.01 },
            { field: 'shippingCost', value: shippingCost, min: 0 },
            { field: 'quantity', value: quantity, min: 1 },
            { field: 'discount', value: discount, min: 0, max: 100 }
        ];

        for (const { field, value, min, max } of numericValidations) {
            const numValue = Number(value);
            if (isNaN(numValue)) {
                console.error(`Invalid ${field}:`, value);
                return res.status(400).json({ 
                    message: `${field} must be a number` 
                });
            }
            if (min !== undefined && numValue < min) {
                console.error(`${field} too low:`, numValue);
                return res.status(400).json({ 
                    message: `${field} must be at least ${min}` 
                });
            }
            if (max !== undefined && numValue > max) {
                console.error(`${field} too high:`, numValue);
                return res.status(400).json({ 
                    message: `${field} must be at most ${max}` 
                });
            }
        }

        // Generate Unique SKU
        let sku;
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 5;
        while (!isUnique && attempts < maxAttempts) {
            sku = generateSKU({ targetAudience, category });
            const existing = await Product.findOne({ sku });
            if (!existing) isUnique = true;
            attempts++;
        }
        if (!isUnique) {
            console.error('SKU generation failed after', maxAttempts, 'attempts');
            return res.status(500).json({ 
                message: "Failed to generate unique product ID" 
            });
        }

        // Process array fields
        const parseArrayField = (fieldName, fieldValue) => {
            try {
                return fieldValue ? JSON.parse(fieldValue) : [];
            } catch (error) {
                console.error(`Invalid ${fieldName}:`, fieldValue);
                throw new Error(`Invalid ${fieldName} format: Must be JSON array`);
            }
        };

        const parsedSizeOptions = parseArrayField('sizeOptions', sizeOptions);
        const parsedColorOptions = parseArrayField('colorOptions', colorOptions);
        const parsedOccasions = parseArrayField('occasions', occasions);

        // Handle image uploads
        const imageUrls = req.files?.map(file => file.path) || []; 

        // Add validation before creating product
        if (imageUrls.length === 0) {
            console.error('Image upload failed. Cloudinary response:', req.files);
            return res.status(400).json({
                message: "Failed to upload product images. Please try again.",
                cloudinaryErrors: req.files?.map(f => f.error) // Capture Cloudinary errors
            });
        }

        // Create product
        const product = new Product({
            name,
            description,
            material,
            sizeOptions: parsedSizeOptions,
            colorOptions: parsedColorOptions,
            careInstructions,
            brandName,
            originalPrice: Number(originalPrice),
            discount: Number(discount) || 0,
            shippingCost: Number(shippingCost),
            images: imageUrls,
            quantity: Number(quantity),
            sku,
            transparency,
            occasions: parsedOccasions,
            countryOfOrigin,
            manufactureDetails,
            itemWeight: itemWeight ? Number(itemWeight) : undefined,
            fabricType,
            fitType,
            targetAudience,
            category,
            seller: req.user._id,
            status: "Pending Approval",
        });

        // Save product
        const savedProduct = await product.save();
        console.log('Product created:', savedProduct._id);

        res.status(201).json({
            message: "Product added successfully. Awaiting approval.",
            product: savedProduct
        });

    } catch (err) {
        console.error('\n--- PRODUCT CREATION ERROR ---');
        console.error('Error:', err.message);
        console.error('Body:', requestBody);
        console.error('Files:', req.files?.map(f => f.originalname));
        console.error('User:', req.user?._id);
        console.error('Stack:', err.stack);
        console.error('------------------------------\n');

        res.status(500).json({
            message: "Product creation failed",
            error: process.env.NODE_ENV === 'production' ? undefined : err.message
        });
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

// Route to get latest 8 products
router.get('/latest', async (req, res) => {
    try {
        const latestProducts = await Product.find({ status: "Active" })
            .sort({ createdAt: -1 }) // latest first
            .limit(8);
        res.status(200).json(latestProducts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching latest products", error });
    }
});

router.get("/seller/product/:id", verifyToken, getProductById);

// Update Product
router.put('/seller/updateProduct/:id', verifyToken, upload.array('images', 5), async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, seller: req.user._id });
        if (!product) {
            return res.status(404).json({ message: "Product not found or unauthorized." });
        }

        // Process images
        let imageUrls = [...product.images];
        if (req.body.imageToDelete) {
            imageUrls = imageUrls.filter(image => image !== req.body.imageToDelete);
        }
        if (req.files?.length) {
            imageUrls.push(...req.files.map(file => file.path));
        }

        // Parse numerical values
        const updates = {
            name: req.body.name || product.name,
            description: req.body.description || product.description,
            material: req.body.material || product.material,
            sizeOptions: req.body.sizeOptions ? JSON.parse(req.body.sizeOptions) : product.sizeOptions,
            colorOptions: req.body.colorOptions ? JSON.parse(req.body.colorOptions) : product.colorOptions,
            careInstructions: req.body.careInstructions || product.careInstructions,
            brandName: req.body.brandName || product.brandName,
            originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : product.originalPrice,
            discount: req.body.discount ? Number(req.body.discount) : product.discount,
            shippingCost: req.body.shippingCost ? Number(req.body.shippingCost) : product.shippingCost,
            images: imageUrls,
            quantity: req.body.quantity ? Number(req.body.quantity) : product.quantity,
            transparency: req.body.transparency || product.transparency,
            occasions: req.body.occasions ? JSON.parse(req.body.occasions) : product.occasions,
            countryOfOrigin: req.body.countryOfOrigin || product.countryOfOrigin,
            manufactureDetails: req.body.manufactureDetails || product.manufactureDetails,
            itemWeight: req.body.itemWeight ? Number(req.body.itemWeight) : product.itemWeight,
            fabricType: req.body.fabricType || product.fabricType,
            fitType: req.body.fitType || product.fitType,
            targetAudience: req.body.targetAudience || product.targetAudience,
            category: req.body.category || product.category
        };

        // Validate numerical updates
        if (updates.originalPrice && (isNaN(updates.originalPrice) || updates.originalPrice <= 0)) {
            return res.status(400).json({ message: "Invalid original price" });
        }
        if (updates.discount && (isNaN(updates.discount) || updates.discount < 0 || updates.discount > 100)) {
            return res.status(400).json({ message: "Discount must be between 0-100%" });
        }

        // Apply updates and save to trigger price calculation
        product.set(updates);
        const updatedProduct = await product.save();

        res.status(200).json({ 
            message: "Product updated successfully.",
            updatedProduct
          });

    } catch (err) {
        res.status(500).json({ 
            message: "Error updating product.", 
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
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

// Public search route (MUST be above dynamic routes)
router.get('/search', searchProductsController);

router.get('/recommendations/:productId/similar', getSimilarProducts);
router.get('/recommendations/:productId/frequently-bought', getFrequentlyBoughtTogether);
router.get('/trending', getTrendingProducts);

router.get('/:targetAudience/:category', getProductsByCategory);

module.exports = router;