import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { RequestSigninDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin } from "../apis/auth";

// 1. 타입 정의
interface AuthContextType {
    accessToken: string|null;
    refreshToken: string|null;
    login: (signData: RequestSigninDto) => Promise<void>;
    logout:() => Promise<void>;
}

// 2. context 기본값 생성
export const AuthContext=createContext<AuthContextType>({
    accessToken:null,
    refreshToken:null,
    login:async()=> {},
    logout:async()=>{},
});

// 3. Provider 컴포넌트
export const AuthProvider=({children}:PropsWithChildren)=>{
    const{
        getItem:getAccessTokenFromStorage,
        setItem:setAccessTokenInStorage,
        removeItem:removeAccessTokenFromStorage,
    }=useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const{
        getItem:getRefreshTokenFromStorage,
        setItem:setRefreshTokenStorage,
        removeItem:removeRefreshFromStorage,
    }=useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    const [accessToken,setAccessToken]=useState<string|null>(
        getAccessTokenFromStorage(),
    );
    const [refreshToken,setRefreshToken]=useState<string|null>(
        getRefreshTokenFromStorage(),
    );
    
    // 로그인(여기서도 alert해주면 두 번 알림 날라감)
    const login=async (siginData:RequestSigninDto)=>{
        try {
            const{ data }=await postSignin(siginData);

            if(data) {
                const newAccessToken=data.accessToken;
                const newRefreshToken=data.refreshToken;

                 // localStorage 저장
                setAccessTokenInStorage(newAccessToken);
                setRefreshTokenStorage(newRefreshToken);

                // context 반영
                setAccessToken(newAccessToken);
                console.log("🔐 setAccessToken 호출 이후 상태:", accessToken);
                setRefreshToken(newRefreshToken);
            }
        } catch(error){
            console.error("로그인 오류",error);
        }

    };

    // 로그아웃
    const logout=async()=>{
        try{
            await postLogout();

            // localStorage 제거
            removeAccessTokenFromStorage();
            removeRefreshFromStorage();

            // context 초기화
            setAccessToken(null);
            setRefreshToken(null);

            alert("로그아웃 성공")
        }catch(error){
            console.error("로그아웃 오류",error);
            alert("로그아웃 실패")
        }
    };

     // 새로고침 시 localStorage -> context 복구
    useEffect(() => {
    const storedAccess = getAccessTokenFromStorage();
    if (storedAccess && !accessToken) {
      setAccessToken(storedAccess);
    }

    const storedRefresh = getRefreshTokenFromStorage();
    if (storedRefresh && !refreshToken) {
      setRefreshToken(storedRefresh);
    } }, []);

    return (
        <AuthContext.Provider value={{accessToken,refreshToken,login,logout}}>
            {children}
        </AuthContext.Provider>
    );
};

// 4. Hook으로 사용하기 쉽게 export
export const useAuth=()=>{
    const context:AuthContextType=useContext(AuthContext);
    if (!context) {
        throw new Error("AuthContext를 찾을 수 없습니다.");
    }
    return context
}