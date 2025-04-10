import React, { useState } from "react";
import axios from "axios";
import { categories } from "../../data/Constants"; // Adjust this import based on your path

const AddProductPage = () => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    material: "",
    sizeOptions: "",
    colorOptions: "",
    careInstructions: "",
    brandName: "",
    price: "",
    discount: "",
    shippingCost: "",
    quantity: "",
    targetAudience: "",
    category: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Reset category if targetAudience is changed
    if (name === "targetAudience") {
      setProductData({ ...productData, targetAudience: value, category: "" });
    } else {
      setProductData({ ...productData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    for (let key in productData) {
      formData.append(key, productData[key]);
    }

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const res = await axios.post(
        "http://localhost:3000/product/seller/addProduct",
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
        price: "",
        discount: "",
        shippingCost: "",
        quantity: "",
        targetAudience: "",
        category: "",
      });
      setImages([]);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("❌ Error adding product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get category list from selected target audience
  const getCategoryOptions = () => {
    const selected = categories[productData.targetAudience?.toUpperCase()];
    if (!selected) return [];
    return selected.flatMap((section) => section.items);
  };

  return (
    <div className="ml-64 p-8 min-h-screen bg-white">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" placeholder="Product Name" value={productData.name} onChange={handleChange} className="border p-2 rounded" />
        <input name="brandName" placeholder="Brand Name" value={productData.brandName} onChange={handleChange} className="border p-2 rounded" />
        <input name="material" placeholder="Material" value={productData.material} onChange={handleChange} className="border p-2 rounded" />
        <input name="sizeOptions" placeholder="Size Options (comma separated)" value={productData.sizeOptions} onChange={handleChange} className="border p-2 rounded" />
        <input name="colorOptions" placeholder="Color Options (comma separated)" value={productData.colorOptions} onChange={handleChange} className="border p-2 rounded" />
        <input name="careInstructions" placeholder="Care Instructions" value={productData.careInstructions} onChange={handleChange} className="border p-2 rounded" />

        {/* 🎯 Target Audience */}
        <select name="targetAudience" value={productData.targetAudience} onChange={handleChange} className="border p-2 rounded">
          <option value="">Select Target Audience</option>
          <option value="Women">Women</option>
          <option value="Men">Men</option>
          <option value="Kids">Kids</option>
        </select>

        {/* 📦 Category */}
        <select name="category" value={productData.category} onChange={handleChange} className="border p-2 rounded">
          <option value="">Select Category</option>
          {getCategoryOptions().map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input name="price" type="number" placeholder="Price" value={productData.price} onChange={handleChange} className="border p-2 rounded" />
        <input name="discount" type="number" placeholder="Discount (%)" value={productData.discount} onChange={handleChange} className="border p-2 rounded" />
        <input name="shippingCost" type="number" placeholder="Shipping Cost" value={productData.shippingCost} onChange={handleChange} className="border p-2 rounded" />
        <input name="quantity" type="number" placeholder="Quantity" value={productData.quantity} onChange={handleChange} className="border p-2 rounded" />
        <textarea name="description" placeholder="Product Description" value={productData.description} onChange={handleChange} className="border p-2 rounded md:col-span-2" />

        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Upload Product Images</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full border p-2 rounded" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white py-2 px-6 rounded hover:opacity-90 md:col-span-2 w-full"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </form>

      {message && (
        <div className="mt-4 text-sm font-medium text-center">
          {message}
        </div>
      )}
    </div>
  );
};

export default AddProductPage;
