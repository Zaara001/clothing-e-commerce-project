import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { navLinks, categories } from "../../data/Constants";
import SearchIcon from "@mui/icons-material/Search";
import Logo from "../../assets/images/Logo.svg";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Badge, { badgeClasses } from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    right: -6px;
  }
`;

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(user);
  const [category, setCategory] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <section>
      <div className={`fixed top-0 left-0 w-full z-50 ${isScrolled ? "h-10 bg-customBrown shadow-md" : "h-24"}`}>
        <div className="flex items-center justify-between px-4 h-full">
          <img className={`h-16 w-16 ${isScrolled ? "z-[60] mt-5 mr-10" : "none"}`} src={Logo} alt="Logo" />
          <h1 className={`text-3xl font-semibold font-aboreto ${isScrolled ? "z-[60] text-black mt-5 ml-32" : "text-white"}`}>
            A U R O R A
          </h1>

          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-700 cursor-pointer hidden md:block">Become a Seller</p>
            <div className={`${isScrolled ? "mt-5 z-[60] ml-3" : "none"}`}>
              <IconButton>
                <ShoppingCartIcon sx={{ fontSize: "30px", color: isScrolled ? "black" : "white" }} />
                <CartBadge badgeContent={2} sx={{ "& .MuiBadge-badge": { bgcolor: isScrolled ? "white" : "gray" } }} overlap="circular" />
              </IconButton>
            </div>

            {/* Account Icon with Dropdown */}
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
                    {currentUser ? (
                      <>
                        <li className="px-4 py-2 font-semibold">Hello, {currentUser.name || currentUser.email}</li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Wishlist</li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">My Orders</li>
                        <li 
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-semibold text-red-500"
                          onClick={handleLogout}
                        >
                          Logout
                        </li>
                      </>
                    ) : (
                      <>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-semibold"
                          onClick={() => navigate("/register")}
                        >
                          Sign In / Register
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => navigate("/register")}
                        >
                          Wishlist
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => navigate("/register")}
                        >
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

        <div className={`${isScrolled ? "w-full bg-customBrown shadow-lg h-16 fixed top-0 left-0 flex items-center px-8" : "w-[1000px] bg-customBrown fixed top-24 flex items-center justify-between px-4 h-[50px] left-1/2 transform -translate-x-1/2"}`}>
          <div className="flex w-[400px] justify-around h-full">
            {navLinks.map((menu) => (
              <div
                key={menu.name}
                className={`cursor-pointer flex flex-col items-center justify-center font-bold text-[14px] font-poppins ${isScrolled ? "ml-20" : "none"}`}
                onMouseEnter={() => setCategory(menu.name)}
                onMouseLeave={() => setCategory(null)}
              >
                {menu.name}
                {category === menu.name && categories[menu.name] && (
                  <div className="absolute left-0 top-full border border-customBrown bg-white shadow-md font-poppins p-2 flex justify-evenly w-[1000px] z-50">
                    {categories[menu.name].map((item) => (
                      <div key={item.title} className="p-2">
                        <h1 className="font-bold text-sm">{item.title}</h1>
                        <ul className="mt-1 space-y-1">
                          {item.items.map((subitem) => (
                            <li key={subitem} className="py-1 text-gray-700 text-sm font-poppins hover:text-black font-normal">
                              {subitem}
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
          <div className={`relative hidden md:block ${isScrolled ? "ml-[500px]" : ""}`}>
            <input
              type="text"
              placeholder="Search..."
              className="w-96 h-8 pl-7 pr-24 py-1 rounded-md border border-gray-300 focus:outline-none"
            />
            <SearchIcon className="absolute left-0 mt-1 pt-1 ml-1" />
            <button className="absolute right-0 top-0 w-20 py-1 bg-gray-200 rounded-r hover:bg-gray-800 hover:text-white">
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
