import { ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = ({ className = "" }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={`bg-black text-white py-10 relative ${className}`}>
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 gap-8">
        {/* Left Section */}
        <div>
          <h2 className="text-2xl font-bold">Aurora</h2>
          <p className="mt-2 text-sm text-gray-400">nivethethaelango@gmail.com</p>
          <p className="text-sm text-gray-400 mt-1">+91 93544 24821</p>
          <button className="border border-white px-4 py-2 mt-4 rounded-lg text-sm hover:bg-white hover:text-black transition">
            <Link to="/contact">Contact Us</Link>
          </button>
        </div>

        {/* Right Section - Navigation Links */}
        <div>
          <h3 className="font-semibold text-lg">Quick Links</h3>
          <ul className="mt-2 space-y-2 text-gray-400 text-sm">
            <li>
              <Link to="/about" className="hover:underline">About Us</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">Contact Us</Link>
            </li>
            <li>
              <Link to="/faqs" className="hover:underline">FAQs</Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms-of-use" className="hover:underline">Terms of Use</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-400 text-sm">
        <p>© 2025 Aurora. All Rights Reserved.</p>
      </div>

      {/* Scroll to Top Button */}
      <button
        className="absolute bottom-6 right-6 bg-customBrown p-3 shadow-md rounded-lg rotate-45 flex items-center justify-center hover:bg-opacity-80"
        onClick={scrollToTop}
      >
        <ArrowUp className="-rotate-45" />
      </button>
    </footer>
  );
};

export default Footer;
