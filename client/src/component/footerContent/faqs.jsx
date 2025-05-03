import React from 'react';
import Header from "../common/Header";
import bgImage from "../../assets/images/headerBackground.png";

const FAQs = () => {
  const faqs = [
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI payments (PhonePe, Google Pay, Paytm), net banking, and cash on delivery (COD) for orders under ₹5000."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard delivery takes 3-5 business days within India. Express delivery (available at checkout) delivers in 1-2 business days to metro cities."
    },
    {
      question: "What is your return policy?",
      answer: "We offer easy 15-day returns for unused items with original tags attached. Simply initiate a return through your account and we'll arrange a pickup."
    },
    {
      question: "How do I know my size?",
      answer: "Each product page has detailed size charts with measurements. We recommend comparing these with your body measurements for the best fit."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Currently we only ship within India. We're working to expand internationally soon!"
    }
  ];

  const shippingFaqs = [
    {
      question: "Do you offer free shipping?",
      answer: "Yes! All orders over ₹1999 qualify for free standard shipping. For orders below this amount, a flat ₹99 shipping fee applies."
    },
    {
      question: "Can I track my order?",
      answer: "Absolutely. Once your order ships, you'll receive a tracking number via SMS and email that you can use to monitor your package's journey."
    },
    {
      question: "What if I'm not home when delivery arrives?",
      answer: "Our delivery partners will attempt delivery twice. After that, the package will be returned to us and we'll contact you to reschedule."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="relative bg-cover bg-center h-[165px]" style={{ backgroundImage: `url(${bgImage})` }}>
        <Header />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12 font-poppins">Frequently Asked Questions</h1>
        
        <div className="space-y-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Ordering & Payments</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-6">
                  <h3 className="font-semibold text-lg mb-2 text-gray-700">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Shipping & Delivery</h2>
            <div className="space-y-6">
              {shippingFaqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-6">
                  <h3 className="font-semibold text-lg mb-2 text-gray-700">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Returns & Exchanges</h2>
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="font-semibold text-lg mb-2 text-gray-700">How do I exchange for a different size?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Initiate a return for your current item and place a new order for the correct size. 
                  We'll process your refund once we receive the original item back in unused condition.
                </p>
              </div>
              <div className="border-b border-gray-200 pb-6">
                <h3 className="font-semibold text-lg mb-2 text-gray-700">Are there any items that can't be returned?</h3>
                <p className="text-gray-600 leading-relaxed">
                  For hygiene reasons, innerwear, socks, and personalized items are final sale and cannot be returned unless defective.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-700">How long do refunds take?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Refunds are processed within 3-5 business days after we receive your return. 
                  Bank processing times may add 2-3 additional business days depending on your payment method.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Still have questions? Our customer care team is happy to help at<br />
            <a href="mailto:nivethethaelango@gmail.com" className="text-blue-600 font-medium">nivethethaelango@gmail.com</a> or +91 98765 43210
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQs;