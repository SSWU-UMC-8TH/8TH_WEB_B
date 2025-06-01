
import useCartStore from "../hooks/useCartStroe";
import useModalStore from "../hooks/useModalStore";

export const PriceBox = () => {
  const { total, clearCart } = useCartStore();
  const openModal = useModalStore((state) => state.openModal);

  return (
    <div className="p-12 flex justify-between">
      <button
        onClick={clearCart}
        className="border p-4 rounded-md cursor-pointer hover:bg-gray-100"
      >
        장바구니 초기화
      </button>
      <button
        onClick={openModal}
        className="border p-4 rounded-md cursor-pointer hover:bg-gray-100"
      >
        전체 삭제
      </button>
      <div>총 가격: {total}원</div>
    </div>
  );
};
