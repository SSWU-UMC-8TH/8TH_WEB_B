// 마이페이지에서 닉네임 수정 시 마이페이지와 냅바에 변경된 닉네임 바로 보이게 하는 Optimistic Update
// Optimistic Update가 작동하려면 데이터를 개시로 관리해야 하고 컴포넌트들이 그 캐시를 읽고 있어야 함 => 오류 생김
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../../apis/auth";

export const useMyInfo = () => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    enabled: !!accessToken, // accessToken이 있을 때만 실행
  });
};

