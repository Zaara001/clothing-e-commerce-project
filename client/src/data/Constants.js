
export const categories = {
    Women: [
      {
        title: "Topwear",
        items: ["All Topwear", "Tops", "Dresses", "T-shirts", "Jumpsuits"],
      },
      {
        title: "Bottomwear",
        items: ["All Bottomwear", "Jeans & Jeggings", "Palazzos", "Shorts", "Skirts"],
      },
      {
        title: "Traditional Wear",
        items: ["Kurtas & Kurtis", "Sarees", "Salwars & Churidars", "Lehengas", "Blouses"],
      },
      {
        title: "Innerwear",
        items: ["Bra", "Women Innerwear", "Briefs"],
      },
      {
        title: "Sleepwear",
        items: ["Nightsuits", "Women Nightdress"],
      },
      {
        title: "Maternity Wear",
        items: ["All Maternity & Feedingwear", "Maternity Kurtis & Dresses"],
      },
      {
        title: "Sports Wear",
        items: ["All Women Sportswear", "Sports Bra"],
      },
    ],
    Men: [
      {
        title: "Topwear",
        items: ["All Topwear", "T-shirts", "Shirts", "Winter Wear", "Jackets", "Sweaters & Sweatshirts"],
      },
      {
        title: "Bottomwear",
        items: ["All Bottomwear", "Jeans", "Trousers", "Shorts", "Track Pants"],
      },
      {
        title: "Men Accessories",
        items: ["All Men Accessories", "Watches", "Belts & Wallets", "Jewellery", "Bags"],
      },
      {
        title: "Men Footwear",
        items: ["Casual Shoes", "Sports Shoes", "Flip Flops & Sandals", "Formal Shoes", "Loafers"],
      },
      {
        title: "Ethnic Wear",
        items: ["Kurtas Sets", "Ethnic Jackets", "Bottomwear"],
      },
      {
        title: "Inner & Sleep Wear",
        items: ["All Inner & Sleep Wear", "Boxers", "Underwears"],
      },
    ],
    Kids: [
      {
        title: "Boys & Girls (2+ Years)",
        items: ["Dresses", "Boys Sets", "Girls Sets", "Ethnicwear", "Nightwear", "Winter Wear", "Top Wear", "Bottomwear"],
      },
      {
        title: "Infant (0-2 Years)",
        items: ["Rompers", "Baby Sets", "Ethnicwear"],
      },
      {
        title: "Toys & Accessories",
        items: ["Soft Toys", "Footwear", "Stationery", "Watches", "Bags & Backpacks"],
      },
      {
        title: "Baby Care",
        items: ["Baby Bedding & Accessories", "All Baby Care", "Newborn Care"],
      },
    ],
  };
  
  export const navLinks = [
    { name: "Home" },
    { name: "Women", subcategories: categories.Women },
    { name: "Men", subcategories: categories.Men },
    { name: "Kids", subcategories: categories.Kids },
  ];