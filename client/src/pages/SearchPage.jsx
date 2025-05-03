import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "../component/common/ProductCard";
import { useSelector } from "react-redux";
import Header from '../component/common/Header';
import Footer from '../component/common/Footer';
import bgImage from "../assets/images/headerBackground.png";

const SearchResults = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Updated selector to match your Redux state structure
  const allProducts = useSelector((state) => state.products?.items || []);
  const isLoading = useSelector((state) => state.products?.isLoading);
  const error = useSelector((state) => state.products?.error);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get("keyword")?.toLowerCase() || "";
    setSearchTerm(keyword);

    if (keyword && allProducts.length > 0) {
      const filtered = allProducts.filter((product) =>
        product.name?.toLowerCase().includes(keyword)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [location.search, allProducts]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading products: {error}</p>;
  }

  return (
    <>

     <div
            className="relative bg-cover bg-center h-[165px]"
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            <Header />
          </div>
    <div className="py-16 px-32">
      <h2 className="text-2xl font-semibold mb-4">
        Search Results for "{searchTerm}"
      </h2>

      {filteredProducts.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
    <Footer />
    </>
  );
};

export default SearchResults;