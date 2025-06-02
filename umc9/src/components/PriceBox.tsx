import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector, useDispatch } from "../hooks/useCustomRedux";
import { openModal } from "../slices/ModalSlice"; // 추가

const PriceBox = (): React.ReactElement => {
    const dispatch = useDispatch();
    const { total } = useSelector((state) => state.cart);

    // 버튼 클릭 시 모달 오픈
    const handleOpenModal = (): void => {
        dispatch(openModal());
    };

    return (
        <div className="p-12 flex justify-end gap-10">
            <button
                onClick={handleOpenModal}
                className='h-15 border p-2 rounded-md cursor-pointer'>
                장바구니 초기화
            </button>
            <div className="mr-80 flex mt-5">총 가격: {total}원</div>
        </div>
    );
};

export default PriceBox;