import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useCartInfo } from "../hooks/useCartStore"; // zustand cart store

const Navbar = (): React.ReactElement => {
    const { amount } = useCartInfo(); // zustand에서 cart 정보 가져오기

    return (
        <div className="flex justify-between item-center p-4 bg-gray-800 text-white">
            <h1
                onClick={() => {
                    window.location.href = '/';
                }}
                className="text-2xl font-semibold cursor-pointer"
            >
                sam2 music
            </h1>
            <div className="flex items-center space-x-2">
                <FaShoppingCart className="text-2xl" />
                <span className="text-xl font-medium">{amount}</span>
            </div>
        </div>
    );
};

export default Navbar;
