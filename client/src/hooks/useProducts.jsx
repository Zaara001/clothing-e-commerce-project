import { useState, useEffect } from 'react';
import { useSeller } from './../context/sellerContext';

export const useProducts = () => {
  const { products, setProducts } = useSeller();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Replace with actual API call
        const mockProducts = [
          { id: '1', name: 'Product 1', price: 100, stock: 10 },
          { id: '2', name: 'Product 2', price: 200, stock: 5 }
        ];
        setProducts(mockProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [setProducts]);

  const addProduct = (product) => {
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return { products, loading, error, addProduct, updateProduct, deleteProduct };
};