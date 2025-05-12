import axios, { InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?:boolean;
}

//전역 변수로 refresh 요청의 Promise를 저장해서 중복 요청을 방지
let refreshPromise: Promise<string>|null=null;

export const axiosInstance=axios.create({
    baseURL: import.meta.env. VITE_SERVER_API_URL, // 백엔드 주소
    withCredentials:true,
})

//요청 인터셉터: 모든 요청 전에 accessToken을 Authorization 헤더에 추가가
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

    //accessToken이 존재하면 Authorization 헤더에 Bearer 토큰 형식으로 추가
    if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },

  (error) => Promise.reject(error),
);

//응답 인터셉터가 실패하면 401에러 발생 => refresh 토큰을 통한 토큰 갱신 처리

axiosInstance.interceptors.response.use(
    (response)=> response,
    async(error)=> {
        const originalRequest:CustomInternalAxiosRequestConfig=error.config;

        //401 에러면서, 아직 재시도 하지 않은 요청 경우 처리
        if (error.response &&
            error.response.status===401 &&
            !originalRequest._retry){
                //refresh 엔드포인트 401 에러가 발생한 경우 중복 재시도 방지를 위해 로그아웃 처리
            if(originalRequest.url==="/v1/auth/refresh") {
                const {removeItem:removeAccessToken} = useLocalStorage(
                    LOCAL_STORAGE_KEY.accessToken,
                );
                const {removeItem:removeRefreshToken}=useLocalStorage (
                    LOCAL_STORAGE_KEY.refreshToken,
                );
                removeAccessToken();
                removeRefreshToken();
                window.location.href="/login";
                return Promise.reject(error);
            }

            //재시도 플래그 설정
            originalRequest._retry=true;

            //이미 refresh 요청이 진행 중 => 그 Promise 재사용
            if(!refreshPromise) {
                //refresh 요청 실행 후 Promise를 전역 변수에 할당
                refreshPromise=(async()=> {
                    const {getItem: getRefreshToken}=useLocalStorage(
                        LOCAL_STORAGE_KEY.refreshToken,
                    );
                    const refreshToken=getRefreshToken();
                    
                    const {data}=await axiosInstance.post("/v1/auth/refresh", {
                        refresh:refreshToken,
                    });
                    //새 토큰이 반환
                    const {setItem:setAccessToken}=useLocalStorage(
                        LOCAL_STORAGE_KEY.refreshToken,
                    );
                    const {setItem:setRefreshToken}=useLocalStorage(
                        LOCAL_STORAGE_KEY.refreshToken,
                    )
                    setAccessToken(data.data.accessToken);
                    setRefreshToken(data.data.refreshToken);
                    //새 accessToken을 반환하여 다른 요청들이 이것을 사용할 수 있게 함
                    return data.data.accessToken;
                })().catch((error)=> {
                    const {removeItem: removeAccessToken}=useLocalStorage(
                        LOCAL_STORAGE_KEY.accessToken,
                    );
                    const {removeItem: removeRefreshToken}=useLocalStorage(
                        LOCAL_STORAGE_KEY.refreshToken,
                    );
                    removeAccessToken()
                    removeRefreshToken()
                })
                .finally(()=> (
                    refreshPromise=null
                ));
            }

            return refreshPromise.then((newAccessToken)=>{
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers["Authorization"]=`Bearer ${newAccessToken}`;
                return axiosInstance.request(originalRequest);
            });
        }
        return Promise.reject(error)
    },
);