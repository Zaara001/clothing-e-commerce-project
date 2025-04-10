import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/images/logo_img.png";

export default function SellerRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email"); // Retrieve email from query parameters

  const [formData, setFormData] = useState({
    email: email || "", // Pre-fill email if available
    businessName: "",
    gstNumber: "",
    bankDetails: {
      accountNumber: "",
      bankName: "",
      ifscCode: "",
    },
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Automatically set the email if it's passed via query parameters
  useEffect(() => {
    if (email) {
      setFormData((prevData) => ({ ...prevData, email }));
    }
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3000/seller/register",
        formData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert("Profile updated successfully!");
        navigate("/seller/dashboard");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="flex max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{
          backgroundImage: `url(${logo})`
        }}></div>
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Complete Your Seller Profile</h2>
          <p className="text-sm text-gray-600 text-center mb-6">Provide your business details to get started</p>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              className="w-full px-4 py-2 mb-4 border rounded-lg text-sm"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              readOnly // Make the email field read-only
            />
            <input
              className="w-full px-4 py-2 mb-4 border rounded-lg text-sm"
              type="text"
              placeholder="Business Name"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              required
            />
            <input
              className="w-full px-4 py-2 mb-4 border rounded-lg text-sm"
              type="text"
              placeholder="GST Number"
              value={formData.gstNumber}
              onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
              required
            />
            <input
              className="w-full px-4 py-2 mb-4 border rounded-lg text-sm"
              type="text"
              placeholder="Bank Account Number"
              value={formData.bankDetails.accountNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bankDetails: { ...formData.bankDetails, accountNumber: e.target.value },
                })
              }
              required
            />
            <input
              className="w-full px-4 py-2 mb-4 border rounded-lg text-sm"
              type="text"
              placeholder="Bank Name"
              value={formData.bankDetails.bankName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bankDetails: { ...formData.bankDetails, bankName: e.target.value },
                })
              }
              required
            />
            <input
              className="w-full px-4 py-2 mb-4 border rounded-lg text-sm"
              type="text"
              placeholder="IFSC Code"
              value={formData.bankDetails.ifscCode}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bankDetails: { ...formData.bankDetails, ifscCode: e.target.value },
                })
              }
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}