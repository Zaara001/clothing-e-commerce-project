import { useState } from "react";
import { navLinks } from "../../data/Constants";
import { categories } from "../../data/Constants";
import SearchIcon from '@mui/icons-material/Search';
import Logo from "../../assets/images/Logo.svg";
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Badge, { badgeClasses } from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    right: -6px;
  }
  `;

const Header = () => {
  const [category, setCategory] = useState(null);

  return (
    <section>
      <div>
      <div className="flex items-center justify-between flex-row">
        <img  className="h-20 w-20 ml-10 " src={Logo} alt="Logo Icon" />
        <h1 className="text-4xl font-semibold text-baseColor flex flex-grow justify-center font-aboreto">A U R O R A</h1>
        <p className="text-base text-white flex justify-center items-center" >Become a Seller</p>
        <IconButton >
      <ShoppingCartIcon  sx={{ fontSize: "30px", color: "white" }} />
      <CartBadge badgeContent={2}  sx={{ "& .MuiBadge-badge": { bgcolor: "gray" } }} overlap="circular" />
    </IconButton>
        <AccountCircleRoundedIcon   sx={{ fontSize: "40px", color: "white" }} />
        </div>
      <div className="flex justify-center">
        <div className="w-full max-w-[1000px] bg-customBrown fixed top-20 flex items-center justify-between px-4 h-[50px]">
          <div className="flex w-[400px] justify-around h-full">
            {navLinks.map((menu) => (
              <div
                key={menu.name}
                className="cursor-pointer flex flex-col items-center justify-center"
                onMouseEnter={() => setCategory(menu.name)}
                onMouseLeave={() => setCategory(null)}
              > 
                {menu.name}
                {category === menu.name && categories[menu.name] && (
                  <div className="absolute left-0 top-full border border-customBrown bg-white shadow-md p-2  flex justify-evenly w-[1000px] z-50">
                    {categories[menu.name].map((item) => (
                      <div key={item.title} className="p-2">
                        <h1 className="font-bold text-sm">{item.title}</h1>
                        <ul className="mt-1 space-y-1">
                          {item.items.map((subitem) => (
                            <li key={subitem} className="py-1 text-gray-700 text-sm hover:text-black">
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
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className=" w-96 h-8 pl-7 pr-24 py-1 rounded-md border border-gray-300 focus:outline-none"
            />
           <SearchIcon className="absolute left-0 mt-1 pt-1 ml-1 "/>
            <button className="absolute right-0 top-0 w-20 py-1 bg- rounded-r bg-gray-200   hover:bg-gray-800 hover:text-white">
              Search
            </button>
          </div>
        </div>
      </div>
      
      </div>
    </section>
  );
};

export default Header;
