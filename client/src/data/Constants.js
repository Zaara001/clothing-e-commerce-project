import { Kids, Men, Saree, Women } from '../assets/images';

import{shirt,kurthi1,kurthi2,jean} from '../assets/images';

import{prom1,prom2,prom3} from '../assets/images';

import blouse from '../assets/images/womenCollectionImage/blouse.jpeg';   
import Dresses from '../assets/images/womenCollectionImage/Dresses.jpg';  
import gymTops from '../assets/images/womenCollectionImage/gymTops.jpg'; 
import jackets from '../assets/images/womenCollectionImage/jackets.jpeg'; 
import jeans from '../assets/images/womenCollectionImage/jeans.jpg';    
import jumpSuits from '../assets/images/womenCollectionImage/jumpSuits.jpg'; 
import kurtas from '../assets/images/womenCollectionImage/kurtas.jpg';    
import lehenga from '../assets/images/womenCollectionImage/lehenga.jpg';  
import maternity from '../assets/images/womenCollectionImage/maternity.jpeg'; 
import nightSuits from '../assets/images/womenCollectionImage/nightSuits.jpg'; 
import palazzo from '../assets/images/womenCollectionImage/palazzo.jpg';  
import salwar from '../assets/images/womenCollectionImage/salwar.jpg';    
import saree from '../assets/images/womenCollectionImage/saree.jpg';      
import shorts from '../assets/images/womenCollectionImage/shorts.jpg';    
import skirts from '../assets/images/womenCollectionImage/skirts.jpg';    
import sportsBra from '../assets/images/womenCollectionImage/sportsBra.jpeg';  
import sportShort from '../assets/images/womenCollectionImage/sportShort.jpg'; 
import tshirt from '../assets/images/womenCollectionImage/tshirt.jpg';    
import yogaPants from '../assets/images/womenCollectionImage/yogaPants.jpg';
import tops from '../assets/images/womenCollectionImage/tops.jpg';


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
        title: "Sleepwear",
        items: ["Nightsuits"],
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


export const WomenCollectionCategories = [
  { name: "Tops", image: tops },
  { name: "Dresses", image: Dresses },
  { name: "T-shirts", image: tshirt },
  { name: "Jumpsuits", image: jumpSuits },

  // 🟣 Bottomwear
  { name: "Jeans & Jeggings", image: jeans },
  { name: "Palazzos", image: palazzo },
  { name: "Shorts", image: shorts },
  { name: "Skirts", image: skirts },

  // 🔵 Traditional Wear
  { name: "Kurtas & Kurtis", image: kurtas },
  { name: "Sarees", image: saree },
  { name: "Salwars & Churidars", image: salwar},
  { name: "Lehengas", image: lehenga },
  { name: "Blouses", image: blouse },

  // 🟡 Sleepwear
  { name: "Nightsuits", image: nightSuits },

  // 🔴 Maternity Wear
  { name: "Maternity Dresses", image: maternity },

  // 🟤 Sports Wear
  { name: "Sports Bra", image: sportsBra },
  { name: "Yoga Pants", image: yogaPants },
  { name: "Gym Tops", image: gymTops },
  { name: "Activewear Jackets", image: jackets },
  { name: "Sports Shorts", image: sportShort }
];

export const images = [prom1, prom2, prom3];

export const categorySlugMap = {
//women
  "Tops": "tops",
  "Dresses": "dresses",
  "T-shirts": "t-shirts",
  "Jumpsuits": "jumpsuits",
  "Jeans & Jeggings": "jeans-jeggings",
  "Palazzos": "palazzos",
  "Shorts": "shorts",
  "Skirts": "skirts",
  "Kurtas & Kurtis": "kurtas-kurtis",
  "Sarees": "sarees",
  "Salwars & Churidars": "salwars-churidars",
  "Lehengas": "lehengas",
  "Blouses": "blouses",
  "Nightsuits": "nightsuits",
  "Maternity Kurtis & Dresses": "maternity-kurtis-dresses",
  "Sports Bra": "sports-bra",

  // MEN
  "T-shirts": "t-shirts-men",
  "Shirts": "shirts",
  "Winter Wear": "winter-wear",
  "Jackets": "jackets",
  "Sweaters & Sweatshirts": "sweaters-sweatshirts",
  "Jeans": "jeans",
  "Trousers": "trousers",
  "Track Pants": "track-pants",
  "Kurtas Sets": "kurtas-sets",
  "Ethnic Jackets": "ethnic-jackets",
  "Boxers": "boxers",
  "Underwears": "underwears",
  //kids
  "Boys Sets": "boys-sets",
  "Girls Sets": "girls-sets",
  "Ethnicwear": "ethnicwear",
  "Nightwear": "nightwear",
  "Top Wear": "top-wear-kids",
  "Bottomwear": "bottomwear-kids",
  "Winter Wear": "winter-wear-kids",
};

export const slugToCategoryName = Object.fromEntries(
  Object.entries(categorySlugMap).map(([name, slug]) => [slug, name])
);
