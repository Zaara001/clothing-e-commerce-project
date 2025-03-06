import { Kids, Men, Saree, Women } from '../assets/images';

import{shirt,kurthi1,kurthi2,jean} from '../assets/images';


export const categories = {
    WOMEN: [
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
    MEN: [
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
    KIDS: [
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
    { name: "HOME" },
    { name: "WOMEN", subcategories: categories.Women },
    { name: "MEN", subcategories: categories.Men },
    { name: "KIDS", subcategories: categories.Kids },
  ];

  export const collectionData = [
    {
      title: "WOMEN COLLECTIONS",
      description: "Go hell for leather or switch it up with suede shoppers, clutches and cross-body bags.",
      image: Women,
      size: " h-[280px] w-[500px]",
      customSize:"w-[120px] h-[305px]" ,
      reverse: false
    },
    {
      title: "MEN COLLECTIONS",
      description: "Give strong street-style game with our range of Nike and adidas backpacks.",
      image: Men,
      size: " h-[280px] w-[500px]",
      customSize:"w-[200px] h-[305px]" ,
      reverse: true
    },
    {
      title: "KIDS COLLECTION",
      description: "The little things make a big difference with our range of accessories.",
      image: Kids,
      size: "h-[280px] w-[500px]",
      customSize:"w-[190px] h-[300px]" ,
      reverse: true
    },
    {
      title: "SAREEN COLLECTION",
      description: "Take your bag hands-free with a cross-body style for instant cool.",
      image: Saree,
      size: " h-[280px] w-[500px]",
      customSize: "w-[195px] h-[305px]" ,
      reverse: false
    }
  ];
  
  export const products = [
    {
      image: shirt,
      title: "Women Full Set Office Wear",
      price: 999,
      oldPrice: 1500,
      discount: "33% off",
    },
    {
      image: kurthi1,
      title: "Women Full Set Office Wear",
      price: 999,
      oldPrice: 1500,
      discount: "33% off",
    },
    {
      image: kurthi2,
      title: "Women Full Set Office Wear",
      price: 999,
      oldPrice: 1500,
      discount: "33% off",
    },
    {
      image: jean,
      title: "Women Full Set Office Wear",
      price: 999,
      oldPrice: 1500,
      discount: "33% off",
    },
  ];




  