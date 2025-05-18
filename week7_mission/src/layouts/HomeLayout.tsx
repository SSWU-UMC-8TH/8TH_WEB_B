import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../componenets/Sidebar";
import { NavBar } from "../componenets/Navbar";
import { Footer } from "../componenets/Footer";


export const HomeLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 바깥 클릭 시 사이드바 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".custom-sidebar") && !target.closest(".hamburger-btn")) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ 창 크기 줄어들면 사이드바 자동 닫기
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-dvh flex">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex flex-col flex-1">
        <NavBar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
        <main className="flex-1 mt-20">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};
