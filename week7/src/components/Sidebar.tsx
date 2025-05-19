import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../apis/axios";

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar = ({ isOpen }: SidebarProps) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // 탈퇴 처리 함수
  const handleWithdraw = async () => {
    try {
      await axiosInstance.delete(`/v1/users`);
      // 로그아웃 처리 등 추가
      navigate("/");
    } catch (e) {
      alert("탈퇴에 실패했습니다.");
    }
  };

  return (
    <div
      className={`
        custom-sidebar
        fixed top-0 left-0 w-90 h-full bg-black text-white z-30
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <nav className="px-4 py-6 space-y-6 mt-10">
        <Link to="/my" className="flex items-center mt-10 ml-5 gap-2 hover:text-pink-400">
          마이페이지
        </Link>
        <button
          className="flex items-center mt-10 ml-5 gap-2 hover:text-red-400"
          onClick={() => setShowModal(true)}
        >
          탈퇴하기
        </button>
      </nav>
      {/* 탈퇴 모달 */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center">
            <span className="mb-4 text-lg font-semibold text-black">정말 탈퇴하시겠습니까?</span>
            <div className="flex gap-4 mt-2">
              <button
                className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
                onClick={() => {
                  handleWithdraw();
                  setShowModal(false);
                }}
              >
                예
              </button>
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                onClick={() => setShowModal(false)}
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};