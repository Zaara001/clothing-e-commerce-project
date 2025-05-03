import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { navLinks } from "../../data/Constants";
import SearchIcon from "@mui/icons-material/Search";
import Logo from "../../assets/images/Logo.svg";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Badge, { badgeClasses } from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, fetchCartItemsAsync } from "../../redux/cartSlice";
import debounce from 'lodash/debounce';

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    right: -6px;
  }
`;

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const products = useSelector((state) => state.products?.items || []);

  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    if (user) {
      dispatch(fetchCartItemsAsync());
    }
  }, [user, dispatch]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    dispatch(clearCart());
    localStorage.removeItem("cartState");
    navigate("/");
  };

  const handleCategoryClick = (gender, category) => {
    const formattedCategory = category.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-');
    navigate(`/${gender.toLowerCase()}/${formattedCategory}`);
    setActiveMenu(null);
  };

  // Debounced search function
  const handleSearch = debounce((value) => {
    const results = products.filter((product) =>
      product.name?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredResults(results);
    setShowSearchResults(value.trim() !== "");
  }, 300);

  useEffect(() => {
    if (keyword.trim() === "") {
      setFilteredResults([]);
      setShowSearchResults(false);
    } else {
      handleSearch(keyword);
    }
  }, [keyword, products]);

  const handleProductClick = (id) => {
    setKeyword("");
    setFilteredResults([]);
    setShowSearchResults(false);
    navigate(`/product/${id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
      setKeyword("");
      setFilteredResults([]);
      setShowSearchResults(false);
    }
  };

  // Handle Escape key press to clear search and results
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setFilteredResults([]);
        setKeyword('');
        setShowSearchResults(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section>
      <div className={`fixed top-0 left-0 w-full z-50 ${isScrolled ? "h-10 bg-customBrown shadow-md" : "h-24"}`}>
        <div className="flex items-center justify-between px-4 h-full">
          <img className={`h-20 w-20 ${isScrolled ? "z-[60] mt-5 mr-10" : ""}`} src={Logo} alt="Logo" />
          <h1 className={`text-4xl font-aboreto ${isScrolled ? "z-[60] text-black font-semibold mt-5 ml-28" : "text-white ml-40"}`}>
            A U R O R A
          </h1>

          <div className="flex items-center gap-4">
            <p
              className="text-base font-vitenam pr-3 text-white cursor-pointer hidden md:block"
              onClick={() => navigate("/seller-login")}
            >
              Become a Seller
            </p>

            <div className={`${isScrolled ? "mt-5 z-[60] ml-3" : ""}`}>
              <IconButton onClick={() => navigate("/cart")}>
                <CartBadge
                  badgeContent={totalItems}
                  sx={{ "& .MuiBadge-badge": { bgcolor: isScrolled ? "white" : "gray" } }}
                  overlap="circular"
                >
                  <ShoppingCartIcon sx={{ fontSize: "30px", color: isScrolled ? "black" : "white" }} />
                </CartBadge>
              </IconButton>
            </div>

            <div
              className="relative"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setTimeout(() => setShowDropdown(false), 300)}
            >
              <AccountCircleRoundedIcon
                sx={{
                  cursor: "pointer",
                  fontSize: "40px",
                  color: isScrolled ? "black" : "white",
                  zIndex: 100,
                  position: "relative",
                  marginRight: isScrolled ? "20px" : "0px",
                  marginTop: isScrolled ? "20px" : "0px",
                }}
              />

              {showDropdown && (
                <div className="absolute right-0 w-48 bg-white border border-gray-300 rounded shadow-md z-50">
                  <ul className="text-gray-700">
                    {user ? (
                      user.role === 'seller' ? (
                        // Seller view - show basic options like logged out state
                        <>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-semibold"
                            onClick={() => navigate("/register")}
                          >
                            Sign In / Register
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => navigate("/order-page")}
                          >
                            My Orders
                          </li>
                        </>
                      ) : (
                        // Customer view - show full options
                        <>
                          <li className="px-4 py-2 font-semibold">Hello, {user.name}</li>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => navigate("/order-page")}
                          >
                            My Orders
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-semibold text-red-500"
                            onClick={handleLogout}
                          >
                            Logout
                          </li>
                        </>
                      )
                    ) : (
                      // Logged out view
                      <>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-semibold"
                          onClick={() => navigate("/register")}
                        >
                          Sign In / Register
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/register")}>
                          My Orders
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className={`${isScrolled
            ? "w-full bg-customBrown shadow-lg h-16 fixed top-0 left-0 flex items-center px-8"
            : "w-[1000px] bg-customBrown fixed top-24 flex items-center justify-between px-4 h-[50px] left-1/2 transform -translate-x-1/2"
            }`}
        >
          <div className="flex w-[400px] justify-around h-full">
            {navLinks.map((menu) => (
              <div
                key={menu.name}
                className={`cursor-pointer flex flex-col items-center justify-center font-semibold text-[14px] font-poppins ${isScrolled ? "ml-20" : ""}`}
                onMouseEnter={() => setActiveMenu(menu.name)}
                onMouseLeave={() => setTimeout(() => setActiveMenu(null), 200)}
                onClick={() => menu.path && navigate(menu.path)} // Add click handler
              >
                {menu.name}
                {activeMenu === menu.name && menu.subcategories && (
                  <div className="absolute left-0 top-full border border-customBrown bg-white shadow-md font-poppins p-2 flex justify-evenly w-[1000px] z-50">
                    {menu.subcategories.map((section) => (
                      <div key={section.title} className="p-2">
                        <h1 className="font-bold text-sm">{section.title}</h1>
                        <ul className="mt-1 space-y-1">
                          {section.items.map((item) => (
                            <li
                              key={item}
                              className="py-1 text-gray-700 text-sm font-poppins hover:text-black font-normal cursor-pointer"
                              onClick={() => handleCategoryClick(menu.name, item)}
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Search input */}
          <div className={`relative hidden md:block ${isScrolled ? "ml-[500px]" : ""}`}>
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onFocus={() => keyword && setShowSearchResults(true)}
                className="pl-8 pr-6 py-2 bg-white text-black rounded-md w-full"
              />
              <button type="submit" className="absolute left-2 top-2">
                <SearchIcon sx={{ fontSize: "20px", color: "gray" }} />
              </button>
            </form>

            {/* Search results dropdown */}
            {showSearchResults && filteredResults.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-1 z-50">
                <ul className="max-h-48 overflow-auto">
                  {filteredResults.map((result) => (
                    <li
                      key={result._id}
                      onClick={() => handleProductClick(result._id)}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                    >
                      {result.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;