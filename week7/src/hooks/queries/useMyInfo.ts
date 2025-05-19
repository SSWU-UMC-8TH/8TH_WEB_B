// 마이페이지에서 닉네임 수정 시 마이페이지와 냅바에 변경된 닉네임 바로 보이게 하는 Optimistic Update
// Optimistic Update가 작동하려면 데이터를 개시로 관리해야 하고 컴포넌트들이 그 캐시를 읽고 있어야 함
import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../../apis/auth";

export const useMyInfo = () => {
  return useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    staleTime: 1000 * 60 * 5, // 선택 옵션: 5분 동안 캐시 유지
  });
};

