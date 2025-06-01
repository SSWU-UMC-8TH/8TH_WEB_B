import { useDispatch,useSelector } from "../hooks/useCustomRedux";
import { clearCart } from "../slices/cartSlice";
import { openModal } from "../slices/modalSlice";
import type { RootState } from "../store/store";



export const PriceBox = () => {
    const {total} = useSelector((state: RootState) =>state.cart);
    const dispatch = useDispatch();
    const handleInitializeCart = ():void => {
        dispatch(clearCart())
    }
  return (
    <div className="p-12 flex justify-between">
        <button onClick={handleInitializeCart} className="border p-4 rounded-md cursor-pointer hover:bg-gray-100">장바구니 초기화</button>
        <button onClick={() => dispatch(openModal())} className="border p-4 rounded-md cursor-pointer hover:bg-gray-100">
            전체 삭제
        </button>
        <div>총 가격: {total}원</div>
    </div>
  )
}
