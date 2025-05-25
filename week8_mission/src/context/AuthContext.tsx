import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { RequestSigninDto, ResponseMyInfoDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin, getMyInfo } from "../apis/auth";

type User = ResponseMyInfoDto["data"];

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>; 
  login: (signData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  user: null,
  setUser: () => {},
  login: async () => {},
  logout: async () => {},
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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (accessToken) {
      getMyInfo()
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, [accessToken]);

  const login = async (signinData: RequestSigninDto) => {
    try {
      const { data } = await postSignin(signinData);
      if (data) {
        setAccessTokenInStorage(data.accessToken);
        setRefreshTokenStorage(data.refreshToken);
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);

        const myInfo = await getMyInfo();
        setUser(myInfo.data);

        window.location.href = "/my";
      }
    } catch (error) {
      console.error("로그인 오류", error);
      alert("로그인 실패");
      throw error;
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
    } catch (error) {
      console.error("로그아웃 오류", error);
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, user, setUser, login, logout }}>
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