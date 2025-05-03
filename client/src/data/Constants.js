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
        items: [ "Tops", "Dresses", "T Shirts", "Jumpsuits"],
      },
      {
        title: "Bottomwear",
        items: [ "Jeans & Jeggings", "Palazzos", "Shorts", "Skirts"],
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
        items: ["Maternity & Feedingwear", "Maternity Kurtis & Dresses"],
      },
      {
        title: "Sports Wear",
        items: ["Women Sportswear", "Sports Bra"],
      },
    ],
    MEN: [
      {
        title: "Topwear",
        items: [ "T Shirts", "Shirts", "Winter Wear", "Jackets", "Sweaters & Sweatshirts"],
      },
      {
        title: "Bottomwear",
        items: [ "Jeans", "Trousers", "Shorts", "Track Pants"],
      },
      {
        title: "Ethnic Wear",
        items: ["Kurtas Sets", "Ethnic Jackets", "Bottomwear"],
      },
      {
        title: "Inner & Sleep Wear",
        items: [" Sleep Wear", "Boxers"],
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
    { 
      name: "HOME",
      path: "/" // Add path for home
    },
    { 
      name: "WOMEN", 
      subcategories: categories.WOMEN 
    },
    { 
      name: "MEN", 
      subcategories: categories.MEN 
    },
    { 
      name: "KIDS", 
      subcategories: categories.KIDS 
    },
  ];

  export const collectionData = [
    {
      title: "W O M E N\u00A0\u00A0C O L L E C T I O N S",
      description: "Elevate your elegance with timeless styles crafted for every woman. Discover the perfect blend of comfort, trend, and confidence.",
      image: Women,
      bgColor : "#FCF0E9",
      customSize: "w-[165px] h-[400px]",
      reverse: false,
    },
    {
      title: "M E N\u00A0\u00A0C O L L E C T I O N S",
      description: "Define your style with bold looks and everyday essentials for men. Step up your wardrobe game with versatile and sharp designs.",
      image: Men, 
      bgColor:"#E9E9E9",
      customSize: "w-[300px] h-[400px]",
      reverse: true,
    },
    {
      title: "K I D S\u00A0\u00A0C O L L E C T I O N",
      description: "Color their world with fun, comfy, and playful fashion picks. Designed to keep up with every little adventure and big smile.",
      image: Kids,
      bgColor : "#E9E9E9",
      customSize: "w-[250px] h-[400px]",
      reverse: true,
    },
    {
      title: "S A R E E\u00A0\u00A0C O L L E C T I O N",
      description: "Wrap yourself in tradition with our stunning saree collection. Celebrate every moment in rich fabrics and timeless designs.",
      image: Saree,
      bgColor:"#FCF0E9",
      customSize: "w-[250px] h-[400px]",
      reverse: false,
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
  { name: "T Shirts", image: tshirt },
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


