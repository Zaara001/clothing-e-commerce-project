import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from "../component/common/Header";
import Footer from "../component/common/Footer";
import bgImage from "../assets/images/headerBackground.png";

const OrderSuccess = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const order = state?.orderSummary;

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center">      
                <h2 className="text-xl font-semibold mb-4">No Order Data Found</h2>
                <button
                    onClick={() => navigate('/')}
                    className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
                >
                    Go to Home
                </button>
            </div>
        );
    }

    const { paymentId, amount, items, address, user } = order;

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header Section with background image */}
            <div
                className="relative bg-cover bg-center h-[165px] w-full"
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                <Header />
            </div>

            {/* Success Content */}
            <div className="flex-grow flex flex-col items-center justify-center p-6 bg-gray-50">
                {/* Green Check Icon */}
                <div className="text-green-600 mb-6">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                {/* Thank You Message */}
                <h2 className="text-2xl font-bold mb-2 text-center">Thank you for your purchase</h2>
                <p className="text-gray-600 mb-8 text-center">
                    We've received your order and it will ship in 5-7 business days.<br/>
                    Your paymentID is <span className="font-semibold">{paymentId}</span>
                </p>

                {/* NEW: Email Confirmation Message */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 w-full max-w-md">
                    <p className="text-blue-700">
                        A confirmation email has been sent to <span className="font-semibold">{user?.email}</span> with your order details.
                    </p>
                </div>

                {/* Order Summary Card */}
                <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
                    <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

                    {/* List of items */}
                    <div className="divide-y divide-gray-200">
                        {items?.map((item, index) => (
                            <div key={index} className="flex items-center justify-between py-4">
                                <div className="flex items-center space-x-4">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                    </div>
                                </div>
                                <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center mt-6 pt-4 border-t font-bold text-lg">
                        <span>Total</span>
                        <span>₹{amount.toFixed(2)}</span>
                    </div>

                    {/* Address Information */}
                    {address && (
                        <div className="mt-8">
                            <h4 className="text-lg font-semibold mb-2">Delivering to</h4>
                            <div className="text-gray-700 leading-relaxed">
                                <p>{address.fullName}</p>
                                <p>{address.street}, {address.city}</p>
                                <p>{address.state} - {address.pincode}</p>
                                <p>Phone: {address.phone}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Back to Home Button */}
                <button
                    onClick={() => navigate('/')}
                    className="mt-8 border border-black text-black px-6 py-2 rounded hover:bg-customBrown hover:text-white transition"
                >
                    Back to Home
                </button>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default OrderSuccess;