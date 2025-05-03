import React, { useState, useMemo } from "react";
import axios from "axios";
import { categories } from "../../data/Constants";

const AddProductPage = () => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    material: "",
    sizeOptions: "",
    colorOptions: "",
    careInstructions: "",
    brandName: "",
    originalPrice: "",
    discount: "",
    shippingCost: "",
    quantity: "",
    targetAudience: "",
    category: "",
    transparency: "",
    occasions: "",
    countryOfOrigin: "",
    manufactureDetails: "",
    itemWeight: "",
    fabricType: "",
    fitType: ""
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const calculatedPrice = useMemo(() => {
    const original = parseFloat(productData.originalPrice) || 0;
    const discount = parseFloat(productData.discount) || 0;
    return (original * (1 - discount / 100)).toFixed(2);
  }, [productData.originalPrice, productData.discount]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate numerical inputs
    if (['originalPrice', 'discount', 'shippingCost', 'quantity', 'itemWeight'].includes(name)) {
      if (value < 0) return;
      if (name === 'discount' && value > 100) return;
    }

    // Reset category if target audience changes
    if (name === "targetAudience") {
      setProductData(prev => ({ 
        ...prev, 
        targetAudience: value, 
        category: "" 
      }));
    } else {
      setProductData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(f => !validTypes.includes(f.type));
    
    if (invalidFiles.length > 0) {
        setMessage("❌ Only JPG/PNG/WEBP images allowed");
        return;
    }
    
    // Validate file sizes (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const largeFiles = files.filter(f => f.size > maxSize);
    
    if (largeFiles.length > 0) {
        setMessage("❌ Each image must be smaller than 10MB");
        return;
    }
    
    setImages(files.slice(0, 5)); // Enforce max 5 files
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

        // Validate all required fields
        if (!isFormValid()) {
          setMessage("❌ Please fill all required fields");
          setLoading(false);
          return;
      }

    // Frontend validation
    if (!productData.originalPrice || parseFloat(productData.originalPrice) <= 0) {
      setMessage("❌ Original price must be greater than 0");
      setLoading(false);
      return;
    }

    if (productData.discount < 0 || productData.discount > 100) {
      setMessage("❌ Discount must be between 0-100%");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    

    
    // Process array fields
    const arrayFields = ['sizeOptions', 'colorOptions', 'occasions'];
    
    Object.entries(productData).forEach(([key, value]) => {
      if (arrayFields.includes(key)) {
          // Convert to array and stringify
          const arrayValue = value.split(',').map(item => item.trim());
          formData.append(key, JSON.stringify(arrayValue));
      } else if (key === 'images') {
          // Handled separately
      } else {
          formData.append(key, value);
      }
  });

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const res = await axios.post(
        "/api/product/seller/addProduct",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setMessage("✅ Product added successfully! Pending admin approval.");
      setProductData({
        name: "",
        description: "",
        material: "",
        sizeOptions: "",
        colorOptions: "",
        careInstructions: "",
        brandName: "",
        originalPrice: "",
        discount: "",
        shippingCost: "",
        quantity: "",
        targetAudience: "",
        category: "",
        transparency: "",
        occasions: "",
        countryOfOrigin: "",
        manufactureDetails: "",
        itemWeight: "",
        fabricType: "",
        fitType: ""
      });
      setImages([]);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.error || 
                         err.message;
      setMessage(`❌ Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryOptions = () => {
    const selected = categories[productData.targetAudience?.toUpperCase()];
    return selected ? selected.flatMap((section) => section.items) : [];
  };

  const isFormValid = () => {
    return (
      productData.name &&
      productData.description &&
      productData.material &&
      productData.originalPrice > 0 &&
      productData.quantity > 0 &&
      productData.targetAudience &&
      productData.category
    );
  };


  return (
    <div className="ml-64 p-8 min-h-screen bg-white">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Information */}
        <input name="name" placeholder="Product Name" value={productData.name} onChange={handleChange} className="border p-2 rounded" required />
        <input name="brandName" placeholder="Brand Name" value={productData.brandName} onChange={handleChange} className="border p-2 rounded" />
        <input name="material" placeholder="Material" value={productData.material} onChange={handleChange} className="border p-2 rounded" required />
        <input name="sizeOptions" placeholder="Size Options (comma separated)" value={productData.sizeOptions} onChange={handleChange} className="border p-2 rounded" />
        <input name="colorOptions" placeholder="Color Options (comma separated)" value={productData.colorOptions} onChange={handleChange} className="border p-2 rounded" />
        <input name="careInstructions" placeholder="Care Instructions" value={productData.careInstructions} onChange={handleChange} className="border p-2 rounded" />

        {/* Target Audience & Category */}
        <select name="targetAudience" value={productData.targetAudience} onChange={handleChange} className="border p-2 rounded" required>
          <option value="">Select Target Audience</option>
          <option value="Women">Women</option>
          <option value="Men">Men</option>
          <option value="Kids">Kids</option>
        </select>

        <select name="category" value={productData.category} onChange={handleChange} className="border p-2 rounded" required>
          <option value="">Select Category</option>
          {getCategoryOptions().map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Pricing Section */}
        <div className="md:col-span-2 grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium">Original Price ($)</label>
            <input
              name="originalPrice"
              type="number"
              min="0.01"
              step="0.01"
              value={productData.originalPrice}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">Discount (%)</label>
            <input
              name="discount"
              type="number"
              min="0"
              max="100"
              value={productData.discount}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="0-100"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">Final Price ($)</label>
            <div className="p-2 bg-gray-50 rounded border">
              ${calculatedPrice || '0.00'}
            </div>
          </div>
        </div>

        {/* Shipping & Quantity */}
        <div className="grid grid-cols-2 gap-4 md:col-span-2">
          <div className="space-y-1">
            <label className="block text-sm font-medium">Shipping Cost ($)</label>
            <input
              name="shippingCost"
              type="number"
              min="0"
              step="0.01"
              value={productData.shippingCost}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">Quantity</label>
            <input
              name="quantity"
              type="number"
              min="1"
              value={productData.quantity}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
        </div>

        {/* Additional Fields */}
        <select name="transparency" value={productData.transparency} onChange={handleChange} className="border p-2 rounded">
          <option value="">Select Transparency</option>
          <option value="Sheer">Sheer</option>
          <option value="Semi-Sheer">Semi-Sheer</option>
          <option value="Opaque">Opaque</option>
        </select>

        <input name="occasions" placeholder="Occasions (comma separated)" value={productData.occasions} onChange={handleChange} className="border p-2 rounded" />
        <input name="countryOfOrigin" placeholder="Country of Origin" value={productData.countryOfOrigin} onChange={handleChange} className="border p-2 rounded" />
        <input name="manufactureDetails" placeholder="Manufacture Details" value={productData.manufactureDetails} onChange={handleChange} className="border p-2 rounded" />
        <input name="itemWeight" type="number" min="0" placeholder="Item Weight (grams)" value={productData.itemWeight} onChange={handleChange} className="border p-2 rounded" />
        <input name="fabricType" placeholder="Fabric Type" value={productData.fabricType} onChange={handleChange} className="border p-2 rounded" />
        
        <select name="fitType" value={productData.fitType} onChange={handleChange} className="border p-2 rounded">
          <option value="">Select Fit Type</option>
          <option value="Regular">Regular</option>
          <option value="Slim">Slim</option>
          <option value="Relaxed">Relaxed</option>
          <option value="Skinny">Skinny</option>
        </select>

        <textarea 
          name="description" 
          placeholder="Product Description" 
          value={productData.description} 
          onChange={handleChange} 
          className="border p-2 rounded md:col-span-2 h-32" 
          required 
        />

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Product Images (Max 5)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border p-2 rounded file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-gray-100 file:text-sm file:font-medium hover:file:bg-gray-200"
          />
          {images.length > 0 && (
            <p className="mt-1 text-sm text-gray-500">
              {images.length} file{images.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !isFormValid()}
          className="bg-black text-white py-3 px-8 rounded hover:bg-gray-800 md:col-span-2 w-full disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Saving...
            </span>
          ) : (
            "Save Product"
          )}
        </button>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded ${message.startsWith("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default AddProductPage;