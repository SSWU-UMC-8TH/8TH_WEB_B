import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../slices/modalSlice";
import { clearCart } from "../slices/cartSlice";
import type { RootState } from "../store/store";

export default function ConfirmModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow text-center w-64">
        <p className="text-lg font-semibold mb-4">정말 삭제하시겠습니까?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => dispatch(closeModal())}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            아니요
          </button>
          <button
            onClick={() => {
              dispatch(clearCart());
              dispatch(closeModal());
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
}
