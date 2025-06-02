import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useCartInfo } from "../hooks/useCartStore";
import useModalStore from "../hooks/useModalStore";

const PriceBox = (): React.ReactElement => {
    const { total } = useCartInfo(); // zustand에서 cart 정보 가져오기
    const openModal = useModalStore((state) => state.openModal); // zustand에서 모달 액션 가져오기

    // 버튼 클릭 시 모달 오픈
    const handleOpenModal = (): void => {
        openModal();
    };

    return (
        <div className="p-12 flex justify-end gap-10">
            <button
                onClick={handleOpenModal}
                className='h-15 border p-2 rounded-md cursor-pointer'>
                전체 삭제
            </button>
            <div className="mr-80 flex mt-5">총 가격: {total}원</div>
        </div>
    );
};

export default PriceBox;