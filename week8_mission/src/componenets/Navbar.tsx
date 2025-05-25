import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMutation } from "@tanstack/react-query";

interface NavBarProps {
  onToggleSidebar?: () => void;
}

export const NavBar = ({ onToggleSidebar }: NavBarProps) => {
  const { accessToken, logout, user } = useAuth();
  const navigate = useNavigate();

  const { mutate: logoutMutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      navigate("/");
      alert("로그아웃 성공");
    },
    onError: () => {
      alert("로그아웃 실패. 다시 시도해주세요.");
    },
  });

  const handleLogout = () => {
    logoutMutate();
  };

  return (
    <nav className="bg-black text-white fixed top-0 w-full z-50 shadow-md">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="cursor-pointer hamburger-btn text-white text-2xl"
          >
            ☰
          </button>
          <Link to="/" className="text-pink-500 text-xl font-bold">
            돌려돌려LP판
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/write" className="text-xl">✏️</Link>

          {!accessToken ? (
            <>
              <Link to="/login" className="text-white hover:text-pink-400">
                로그인
              </Link>
              <Link
                to="/signup"
                className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600"
              >
                회원가입
              </Link>
            </>
          ) : (
            <>
              <span>{user?.name}님 환영합니다.</span>
              <button
                onClick={handleLogout}
                className="cursor-pointer hover:text-pink-400"
                disabled={isPending}
              >
                {isPending ? "로그아웃 중..." : "로그아웃"}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};