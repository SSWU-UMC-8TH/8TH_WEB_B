import { FaShoppingCart } from "react-icons/fa";
import { useEffect } from "react";
import useCartStore from "../hooks/useCartStroe";

export const Navbar = () => {
  const { amount, cartItems, calculateTotals } = useCartStore();

  useEffect(() => {
    calculateTotals();
  }, [cartItems, calculateTotals]);

  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1
        onClick={() => {
          window.location.href = "/";
        }}
        className="cursor-pointer text-2xl font-semibold"
      >
        Sueon
      </h1>
      <div className="flex items-center space-x-2">
        <FaShoppingCart className="text-2xl" />
        <span className="text-xl font-medium">{amount}</span>
      </div>
    </div>
  );
};
