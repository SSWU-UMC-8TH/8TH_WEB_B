import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { RequestSigninDto, ResponseMyInfoDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin, getMyInfo } from "../apis/auth";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (signData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
  user: ResponseMyInfoDto | null;
  setUser: React.Dispatch<React.SetStateAction<ResponseMyInfoDto | null>>;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  login: async () => {},
  logout: async () => {},
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const {
    getItem: getAccessTokenFromStorage,
    setItem: setAccessTokenInStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenStorage,
    removeItem: removeRefreshFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const [accessToken, setAccessToken] = useState<string | null>(getAccessTokenFromStorage());
  const [refreshToken, setRefreshToken] = useState<string | null>(getRefreshTokenFromStorage());
  const [user, setUser] = useState<ResponseMyInfoDto | null>(null);

  const login = async (signData: RequestSigninDto) => {
    try {
      const { data } = await postSignin(signData);
      if (data) {
        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        setAccessTokenInStorage(newAccessToken);
        setRefreshTokenStorage(newRefreshToken);
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        console.log("🔐 setAccessToken 호출 이후 상태:", newAccessToken);
      }
    } catch (error) {
      console.error("로그인 오류", error);
    }
  };

  const logout = async () => {
    try {
      await postLogout();
      removeAccessTokenFromStorage();
      removeRefreshFromStorage();
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      alert("로그아웃 성공");
    } catch (error) {
      console.error("로그아웃 오류", error);
      alert("로그아웃 실패");
    }
  };

  useEffect(() => {
    const storedAccess = getAccessTokenFromStorage();
    if (storedAccess && !accessToken) {
      setAccessToken(storedAccess);
    }
    const storedRefresh = getRefreshTokenFromStorage();
    if (storedRefresh && !refreshToken) {
      setRefreshToken(storedRefresh);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      getMyInfo()
        .then((res) => setUser(res))
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, login, logout, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext를 찾을 수 없습니다.");
  }
  return context;
};
