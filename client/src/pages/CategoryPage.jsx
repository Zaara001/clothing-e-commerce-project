import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../component/common/Header';
import Footer from '../component/common/Footer';
import ProductCard from '../component/common/ProductCard';
import bgImage from "../assets/images/headerBackground.png";


const CategoryPage = () => {
  const { targetAudience, category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const normalizeForApi = (text) => {
          return text
            .toLowerCase()
            .replace(/-/g, ' ')
            .replace(/\s+/g, ' ')
            .replace(/ and /g, ' & ')
            .trim();
        };

        const decodedTarget = decodeURIComponent(targetAudience);
        const decodedCategory = decodeURIComponent(category);
        
        const apiTarget = normalizeForApi(decodedTarget);
        const apiCategory = normalizeForApi(decodedCategory);
        
        const response = await axios.get(`/api/product/${apiTarget}/${apiCategory}`);
        
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to fetch products');
        }

        setProducts(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.message || err.message || 'Products not found');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [targetAudience, category]);

  const formatDisplayText = (text) => {
    return decodeURIComponent(text)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return (
    <div className="text-center py-8">
      <p className="text-red-500">{error}</p>
      <Link to="/" className="text-blue-500 mt-4 inline-block">
        Return to Home
      </Link>
    </div>
  );

  return (
    <>
    <div
      className="relative bg-cover bg-center h-[165px]"
                  style={{ backgroundImage: `url(${bgImage})` }}>
      <Header />
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 ml-24">
          <h1 className="text-3xl font-bold">
            {formatDisplayText(targetAudience)} - {formatDisplayText(category)}
          </h1>
          <p className="text-gray-600 mt-2">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg">No products found in this category</p>
            <Link to="/" className="text-blue-500 mt-4 inline-block">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap mx-24 gap-5 ">
            {products.map(product => (
              <ProductCard 
                key={product._id} 
                product={product}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default CategoryPage;
