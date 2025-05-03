import React from "react";
import StatusBadge from "./StatusBadge";
import { Pencil, Trash } from "lucide-react";

const ProductRow = ({ product, onEdit, onDelete }) => {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="py-2 px-2"><input type="checkbox" /></td>

      <td className="py-2 px-2 flex items-center gap-2">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-10 h-10 rounded object-cover" 
        />
        <div>
          <p className="font-semibold">{product._id}</p>
          <p className="text-sm text-gray-600">{product.name}</p>
        </div>
      </td>

      <td className="py-2 px-2">₹{product.price}</td>
      <td className="py-2 px-2">{product.sizeOptions?.join(", ")}</td>
      <td className="py-2 px-2">{product.quantity}</td>
      <td className="py-2 px-2">
        {new Date(product.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </td>
      <td className="py-2 px-2">
        <StatusBadge status={product.status} />
      </td>
      <td className="py-2 px-2 flex gap-2">
        <Pencil
          className="w-4 h-4 text-gray-700 hover:text-black cursor-pointer"
          onClick={() => onEdit(product)}
        />
        <Trash
          className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer"
          onClick={() => onDelete(product._id)}
        />
      </td>
    </tr>
  );
};

export default ProductRow;
