import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setAddresses, setSelectedAddress } from "../redux/addressSlice";
import {CheckoutSteps} from '../pages/Cart'; 
import Header from '../component/common/Header';
import Footer from '../component/common/Footer';
import bgImage from "../assets/images/headerBackground.png";

const AddressPage = () => {
  const [addressesState, setAddressesState] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    street: "",
    city: "",
    state: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    street: "",
    city: "",
    state: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const addresses = useSelector((state) => state.address.addresses);
  const selectedAddress = useSelector((state) => state.address.selectedAddress);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/address/users", { withCredentials: true });
      dispatch(setAddresses(res.data));
      setAddressesState(res.data);
    } catch (err) {
      toast.error("Failed to load addresses. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "fullName":
        if (!value.trim()) error = "Full name is required";
        else if (value.length < 3) error = "Name must be at least 3 characters";
        else if (!/^[a-zA-Z ]+$/.test(value)) error = "Name can only contain letters and spaces";
        break;
      case "phone":
        if (!value.trim()) error = "Phone number is required";
        else if (!/^[0-9]{10}$/.test(value)) error = "Phone must be 10 digits";
        break;
      case "pincode":
        if (!value.trim()) error = "Pincode is required";
        else if (!/^[0-9]{6}$/.test(value)) error = "Pincode must be 6 digits";
        break;
      case "street":
        if (!value.trim()) error = "Street address is required";
        else if (value.length < 5) error = "Address is too short";
        break;
      case "city":
        if (!value.trim()) error = "City is required";
        else if (!/^[a-zA-Z ]+$/.test(value)) error = "City can only contain letters";
        break;
      case "state":
        if (!value.trim()) error = "State is required";
        else if (!/^[a-zA-Z ]+$/.test(value)) error = "State can only contain letters";
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
    
    // Validate the field and update errors
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    
    Object.keys(newAddress).forEach((field) => {
      const error = validateField(field, newAddress[field]);
      newErrors[field] = error;
      if (error) isValid = false;
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/address/users", newAddress, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        toast.success("Address added successfully!");
        setNewAddress({ fullName: "", phone: "", pincode: "", street: "", city: "", state: "" });
        await fetchAddresses();
      }
    } catch (err) {
      let errorMessage = "Failed to add address";
      if (err.response?.status === 401) {
        errorMessage = "Please login again";
        navigate("/login");
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await axios.delete(`/api/address/users/${id}`, { withCredentials: true });
      toast.success("Address deleted successfully!");
      await fetchAddresses();
    } catch (err) {
      toast.error("Failed to delete address");
    }
  };

  const handleProceedToPayment = () => {
    if (!selectedAddress) {
      toast.warning("Please select an address");
      return;
    }
    navigate("/checkout/payment");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Title */}
      <div
              className="relative bg-cover bg-center h-[165px]"
              style={{ backgroundImage: `url(${bgImage})` }}
            >
              <Header />
            </div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 pt-10">Check Out</h1>
        
      </div>
      {/* Checkout Steps */}
      <CheckoutSteps currentStep={1} /> {/* Address step */}
      
      

      {/* Address Section */}
      <div className="bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Select Delivery Address</h2>

        {addressesState.length === 0 ? (
          <p className="text-gray-500 mb-6">No addresses saved yet.</p>
        ) : (
          <div className="grid gap-4 mb-10">
            {addressesState.map((address) => (
              <div
                key={address._id}
                onClick={() => dispatch(setSelectedAddress(address))}
                className={`border p-4 rounded-lg cursor-pointer transition ${
                  selectedAddress?._id === address._id
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">{address.fullName}</p>
                    <p className="text-gray-600">{address.phone}</p>
                    <p className="text-gray-600">{address.street}, {address.city}, {address.state} - {address.pincode}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAddress(address._id);
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
                {selectedAddress?._id === address._id && (
                  <div className="mt-2 text-black text-sm font-medium">
                    ✓ Selected for delivery
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {addressesState.length > 0 && (
          <button
            onClick={handleProceedToPayment}
            className="w-full py-3 rounded-lg bg-[#A06E4A] text-white font-semibold hover:bg-[#8c5c3d] transition"
          >
            Proceed to Payment
          </button>
        )}
      </div>

      {/* Add New Address */}
      <div className="bg-white rounded-xl shadow p-8 mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add New Address</h2>

        <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(newAddress).map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-gray-700 mb-2">
                {field === "fullName"
                  ? "Full Name"
                  : field === "pincode"
                  ? "Pincode"
                  : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                id={field}
                name={field}
                type={field === "phone" || field === "pincode" ? "tel" : "text"}
                value={newAddress[field]}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors[field] ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-black"
                }`}
                required
              />
              {errors[field] && <p className="mt-1 text-sm text-red-600">{errors[field]}</p>}
            </div>
          ))}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#A06E4A] text-white font-semibold rounded-lg hover:bg-[#8c5c3d] transition disabled:bg-[#A06E4A]"
            >
              {isSubmitting ? "Adding..." : "Add Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressPage;