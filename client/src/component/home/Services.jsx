import { useState } from "react";
import { ChevronLeft, ChevronRight, Truck, RefreshCw, ShieldCheck } from "lucide-react";
import { images } from "../../data/Constants"; // Import images from constants.js

export default function ServicesComponent() {
  const [currentImage, setCurrentImage] = useState(0);

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-gray-100 py-10 relative top-[1500px] ">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-center gap-4">
          <div className="relative w-2/3 flex justify-center items-center">
            <img
              src={images[currentImage]}
              alt="Showcase"
              className=" rounded-md shadow-md h-[500px] w-[400px] object-cover"
            />
            <button
              className="absolute left-36 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
              onClick={prevImage}
            >
              <ChevronLeft />
            </button>
            <button
              className="absolute right-36 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
              onClick={nextImage}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
        <div className="mt-32 grid grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <Truck size={32} />
            <h3 className="font-semibold">Free Shipping</h3>
            <p className="text-sm">On orders of INR 1500 and above</p>
          </div>
          <div className="flex flex-col items-center">
            <RefreshCw size={32} />
            <h3 className="font-semibold">Easy Returns</h3>
            <p className="text-sm">Free returns until 7 days of delivery</p>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck size={32} />
            <h3 className="font-semibold">Secure Payment</h3>
            <p className="text-sm">Safe & hassle-free checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
}
