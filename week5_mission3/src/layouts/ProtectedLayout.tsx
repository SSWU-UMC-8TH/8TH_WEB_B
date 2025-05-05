import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext"

export const ProtectedLayout = () => {
    const{accessToken}=useAuth();

    if(!accessToken){
        console.log("accessToken이 없습니다. 로그인 페이지로 이동합니다.");
        return <Navigate to={"/login"}replace/>
    }
    return <Outlet/>;
}

export default ProtectedLayout;
