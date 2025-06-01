import { FaShoppingCart } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../store/store";
import { useEffect } from "react";
import { calculateTotals } from "../slices/cartSlice";


export const Navbar = () => {
    const {amount, cartItems} = useSelector((state: RootState) =>state.cart);
    const dispatch = useDispatch();

    useEffect(():void => {
        dispatch(calculateTotals());
    }, [dispatch, cartItems])
  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <h1 onClick={():void => {window.location.href='/'}} className="cursor-pointer text-2xl font-semibold"> Ohthani Ahn</h1>
        <div className="flex items-center space-x-2">
            <FaShoppingCart className="text-2xl"/>
            <span className="text-xl font-medium">{amount}</span>
        </div>
    </div>
  )
}