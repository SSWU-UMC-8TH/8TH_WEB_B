import { useQuery } from "@tanstack/react-query";
import { PaginationDto } from "../../types/commons";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

export function useGetLpList({cursor, search, order, limit}: PaginationDto){
    return useQuery({
        queryKey: [QUERY_KEY.lps],
        queryFn:() =>
            getLpList({
                cursor,
                search,
                order,
                limit,
            }),
            staleTime: 1000*60*5,
            gcTime:100*60*10,
    });
}