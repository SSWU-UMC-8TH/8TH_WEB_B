import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import { Footer } from "../componenets/Footer";
import { NavBar } from "../componenets/Navbar";



export const ProtectedLayout = () => {
    const{accessToken}=useAuth();
    if(!accessToken){
        return <Navigate to={"/login"}replace/>
    }
    return (
        <div className="h-dvh flex flex-col">
            <NavBar/>
            <main className="flex-1 mt-20">
            <Outlet/>
            </main>
            <Footer/>
        </div>
    )
}
