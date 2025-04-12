import { Outlet } from "react-router-dom"

export const HomeLayout = () => {
  return (
    <div className="h-dvh flex flex-col">
      <nav className="w-full bg-black py-4">
        <ul className="flex justify-center gap-8 text-lg font-medium">
          <li>
            <a
              href="/"
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              홈
            </a>
          </li>
          <li>
            <a
              href="/login"
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              로그인
            </a>
          </li>
          <li>
            <a
              href="/signup"
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              회원가입
            </a>
          </li>
          <li>
            <a
              href="/my"
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              마이페이지
            </a>
          </li>
        </ul>
      </nav>

      <main className="flex-1">
        <Outlet /> {/* Outlet에는 children들이 렌더링 됨 */}
      </main>
      <footer>푸터</footer>
    </div>
  )
};
