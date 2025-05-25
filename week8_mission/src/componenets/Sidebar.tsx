import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { deleteUser } from "../apis/user";


interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar = ({ isOpen }: SidebarProps) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();

  const { mutate: deleteAccount } = useMutation({
    mutationFn: deleteUser, 
    onSuccess: () => {
      alert("탈퇴가 완료되었습니다.");
      window.location.href = "/login";
    },
    onError: () => {
      alert("탈퇴에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const handleDeleteClick = () => {
    setShowConfirmModal(true); 
  };

  const handleConfirm = () => {
    deleteAccount(); 
    setShowConfirmModal(false); 
  };

  const handleCancel = () => {
    setShowConfirmModal(false); 
  };

  return (
    <>
      <div
        className={`
          custom-sidebar
          fixed top-0 left-0 w-60 h-full bg-black text-white z-30
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <nav className="px-4 py-6 space-y-6 mt-10">
          <Link to="/search" className="flex items-center gap-2 hover:text-pink-400">
            🔍 찾기
          </Link>
          <Link to="/my" className="flex items-center gap-2 hover:text-pink-400">
            👤 마이페이지
          </Link>
        </nav>

        <div
          className="absolute bottom-4 left-4 text-sm text-gray-400 cursor-pointer hover:text-white"
          onClick={handleDeleteClick}
        >
          탈퇴하기
        </div>
      </div>

      {/*  탈퇴 확인 모달 */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded shadow-md w-80">
            <p className="mb-4">정말 탈퇴하시겠습니까?</p>
            <div className="flex justify-end gap-3">
              <button onClick={handleCancel} className="px-4 py-2 bg-gray-300 rounded">
                아니오
              </button>
              <button onClick={handleConfirm} className="px-4 py-2 bg-red-500 text-white rounded">
                예
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
