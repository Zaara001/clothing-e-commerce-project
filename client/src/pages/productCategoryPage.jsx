import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../component/common/Header';
import Footer from '../component/common/Footer';
import FilterSidebar from '../component/common/FilterSidebar';
import SortBar from '../component/common/SortBar';
import ProductCard from '../component/common/ProductCard';
import { slugToCategoryName } from '../data/Constants';
import bgImage from "../assets/images/headerBackground.png";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const originalCategoryName = slugToCategoryName[categoryName];

        if (!originalCategoryName) {
          console.error('Invalid category slug:', categoryName);
          setProducts([]);
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/product/category/${originalCategoryName}`,
          { withCredentials: true }
        );

        setProducts(Array.isArray(response.data.products) ? response.data.products : []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  const categoryDisplayName = slugToCategoryName[categoryName];

  if (!categoryDisplayName) {
    return (
      <div className="text-center mt-10 text-red-600">
        Invalid category selected.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative bg-cover bg-center h-[165px]" style={{ backgroundImage: `url(${bgImage})` }}>
        <Header />
      </div>
      
      <div className="flex flex-1">
        <FilterSidebar />
        
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {categoryDisplayName} ({products.length})
            </h2>
            <SortBar />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg">Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-lg text-gray-600">No products found for this category.</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;