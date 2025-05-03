import { Truck, Star, ShieldCheck } from "lucide-react";
import { images } from "../../data/Constants"; // Assuming you'll use it elsewhere

export default function BenefitsSection() {
  const features = [
    {
      icon: <Truck size={36} className="text-black mb-2" />,
      title: "Free Shipping",
      description: "On orders of INR 1500 and above",
    },
    {
      icon: <Star size={36} className="text-black mb-2" />,
      title: "Premium Quality",
      description: "Top-rated products from trusted sellers",
    },
    {
      icon: <ShieldCheck size={36} className="text-black mb-2" />,
      title: "Secure Payment",
      description: "Safe & hassle-free checkout",
    },
  ];

  return (
    <div className="bg-gray-100 py-16 relative">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center">
              {feature.icon}
              <h3 className="font-semibold text-lg mt-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
