import { Outlet } from "react-router-dom";

const HomeLayout = () => {
    return (
        <div className="h-dvh flex flex-col">
            <nav className="flex justify-center items-center h-16 bg-pink-100">
            냅 바</nav>
            <main className="flex-1">
                <Outlet />
            </main>
            <footer className="flex justify-center items-center h-16 bg-pink-100">
            푸터</footer>
        </div>
    );
};

export default HomeLayout;