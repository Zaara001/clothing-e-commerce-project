import { useParams, useNavigate } from 'react-router-dom';
import SellerSidebar from './../../component/seller/SellerSidebar';
import { useProducts } from '../../hooks/useProducts';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, updateProduct } = useProducts();

  // Find the product to edit
  const productToEdit = products.find(p => p.id === id);

  const handleSubmit = (updatedProduct) => {
    updateProduct(id, updatedProduct);
    navigate('/seller/products');
  };

  if (!productToEdit) {
    return (
        <div className="flex-1 ml-64 p-6">
          <p>Product not found</p>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SellerSidebar />
      
      <div className="flex-1 ml-64 p-6">
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/seller/dashboard" className="hover:text-primary">Dashboard</Link>
          <span className="mx-2">/</span>
          <Link to="/seller/products" className="hover:text-primary">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-primary">Edit Product</span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Product</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <ProductForm 
            onSubmit={handleSubmit}
            initialValues={productToEdit}
            isEditMode={true}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;