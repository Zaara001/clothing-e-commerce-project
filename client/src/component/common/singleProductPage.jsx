import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SingleProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/product/getOne/${id}`, {
          withCredentials: true, // ✅ send cookies with the request
        });
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="p-10 text-center text-xl">Loading product...</div>;
  }

  if (!product) {
    return <div className="p-10 text-center text-red-500">Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Header */}
      <header className="bg-black text-white py-4 px-8 flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Aurora</h1>
        <nav className="space-x-6">
          <a href="/" className="hover:underline">HOME</a>
          <a href="/women" className="hover:underline">WOMEN</a>
          <a href="#" className="hover:underline">MEN</a>
          <a href="#" className="hover:underline">KIDS</a>
        </nav>
      </header>

      {/* Main Product Section */}
      <div className="px-8 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex md:flex-col gap-2">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Thumb ${i}`}
                className="w-20 h-24 object-cover border"
                onError={(e) => (e.target.src = "/fallback.png")}
              />
            ))}
          </div>
          <img
            src={product.images?.[0] || "/fallback.png"}
            alt="Main"
            className="w-full h-auto max-w-md object-cover border"
            onError={(e) => (e.target.src = "/fallback.png")}
          />
        </div>

        {/* Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{product.name}</h2>
          <div className="flex items-center space-x-2">
            <span className="text-yellow-500">★★★★☆</span>
            <span>({product.reviews?.length || 0} Reviews)</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            Rs. {product.price}
            {product.originalPrice && (
              <>
                <span className="line-through text-gray-500 text-sm ml-2">
                  Rs. {product.originalPrice}
                </span>
                <span className="text-green-600 text-sm ml-1">
                  ({product.discountPercentage || 30}% off)
                </span>
              </>
            )}
          </div>

          {/* Size */}
          <div>
            <h3 className="font-medium mb-1">Select Size</h3>
            <div className="flex gap-3">
              {product.availableSizes?.map((size) => (
                <button
                  key={size}
                  className="border px-3 py-1 rounded hover:bg-gray-200"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 mt-4">
            <button className="bg-black text-white px-6 py-2 rounded">
              ADD TO CART
            </button>
            <button className="bg-yellow-500 text-black px-6 py-2 rounded">
              BUY
            </button>
          </div>

          {/* Offers */}
          <div className="mt-4 text-sm">
            <p>
              <strong>Special offer:</strong> Get 25% off{" "}
              <a className="text-blue-600" href="#">
                T&C
              </a>
            </p>
            <p>
              <strong>Bank offer:</strong> 30% off on Axis Bank Credit Card{" "}
              <a className="text-blue-600" href="#">
                T&C
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="border-t mt-10 px-8 pt-6">
        <h3 className="text-lg font-semibold mb-2">Product Details</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Category:</strong> {product.category}</li>
          <li><strong>Fabric:</strong> {product.fabric}</li>
          <li><strong>Pattern:</strong> {product.pattern}</li>
          <li><strong>Origin:</strong> {product.countryOfOrigin || "India"}</li>
        </ul>
      </div>
    </div>
  );
};

export default SingleProductPage;
