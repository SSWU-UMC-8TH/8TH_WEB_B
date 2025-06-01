import { useSelector } from "react-redux"
import { CartItem } from "./CartItem"
import type { RootState } from "../store/store";

export const CarList = () => {
    const {cartItems}=useSelector((state:RootState) => state.cart);
  return (
    <div className="flex flex-col items-center justify-center">
        <ul>
            {cartItems.map((item) => (
                <CartItem key={item.id} lp={item}/>
            ))}
        </ul>
    </div>
  )
}
