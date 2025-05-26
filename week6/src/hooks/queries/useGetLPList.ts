import { useQuery } from "@tanstack/react-query";
import { PaginationDto } from "../../types/commons";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

export function useGetLpList({cursor, search, order, limit}: PaginationDto){
    return useQuery({
        queryKey: [QUERY_KEY.lps, search],
        queryFn:() =>
            getLpList({
                cursor,
                search,
                order,
                limit,
            }),
            //5분 동안 기존 데이터를 그대로 활용해서 네트워크 요청을 줄인다
            staleTime: 1000*60*5,

            //10분 동안 사용되지 않으면 해당 캐시 데이터가 삭제되어, 다시 요청 시 새 데이터를 받아오게 한다.
            gcTime:100*60*10,
    });
}

export default useGetLpList; 

