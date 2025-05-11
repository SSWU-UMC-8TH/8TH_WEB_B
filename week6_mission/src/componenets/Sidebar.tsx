import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar = ({ isOpen }: SidebarProps) => (
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

    <div className="absolute bottom-4 left-4 text-sm text-gray-400 cursor-pointer hover:text-white">
      탈퇴하기
    </div>
  </div>
);
