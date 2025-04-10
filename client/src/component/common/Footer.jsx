import { ArrowUp, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const Footer = ({ className = "" }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={`bg-black text-white py-10 relative ${className}`}>
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-4 gap-8">
        {/* Left Section */}
        <div>
          <h2 className="text-xl font-bold">SiteLogo</h2>
          <p className="mt-2">+91 9354424821</p>
          <div className="flex gap-3 mt-4">
            <Facebook size={20} />
            <Instagram size={20} />
            <Twitter size={20} />
            <Linkedin size={20} />
          </div>
          <button className="border border-white px-4 py-2 mt-4 rounded-lg">Contact Us</button>
        </div>

        {/* Middle Sections */}
        <div>
          <h3 className="font-semibold">Product</h3>
          <ul className="mt-2 space-y-1 text-gray-400">
            <li>Landing Page</li>
            <li>Popup Builder</li>
            <li>Web-design</li>
            <li>Content</li>
            <li>Integrations</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">Resources</h3>
          <ul className="mt-2 space-y-1 text-gray-400">
            <li>Academy</li>
            <li>Blog</li>
            <li>Themes</li>
            <li>Hosting</li>
            <li>Developers</li>
            <li>Support</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">Company</h3>
          <ul className="mt-2 space-y-1 text-gray-400">
            <li>About Us</li>
            <li>Careers</li>
            <li>FAQs</li>
            <li>Teams</li>
            <li>Contact Us</li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-400 text-sm">
        <p>© 2025 All Rights Reserved</p>
        <div className="flex justify-center gap-4 mt-2">
          <span>Privacy Policy</span>
          <span>Terms of Use</span>
          <span>Sales and Refunds</span>
          <span>Legal</span>
          <span>Site Map</span>
        </div>
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
