import React, { useEffect, useState } from "react";
import ProductRow from "./ProductRow";
import axiosInstance from "../../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchSellerProducts = async () => {
    try {
      const response = await axiosInstance.get("/api/product/seller/viewProduct", {
        withCredentials: true,
      });
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  const handleEditProduct = (product) => {
    navigate(`/seller/edit-product/${product._id}`);
  };

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/api/product/seller/deleteProduct/${productId}`, {
        withCredentials: true,
      });
      toast.success("Product deleted successfully");
      fetchSellerProducts(); // Refresh after delete
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete product");
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white p-4 rounded shadow overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-300 text-black">
            <th className="py-2 px-2"><input type="checkbox" /></th>
            <th className="py-2 px-2">Product</th>
            <th className="py-2 px-2">Price</th>
            <th className="py-2 px-2">Size</th>
            <th className="py-2 px-2">QTY</th>
            <th className="py-2 px-2">Date</th>
            <th className="py-2 px-2">Status</th>
            <th className="py-2 px-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow
              key={product._id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
