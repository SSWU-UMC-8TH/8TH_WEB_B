import { useInfiniteQuery } from "@tanstack/react-query";
import { PAGINATION_ORDER } from "../../enums/common";
import { axiosInstance } from "../../apis/axios";

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    name: string;
    avatar: string;
  };
}

interface CommentsResponse {
  data: Comment[];
  hasNext: boolean;
}

export const useGetInfiniteComments = (
  lpId: string | undefined,
  limit: number,
  order: PAGINATION_ORDER
) => {
  return useInfiniteQuery<CommentsResponse>({
    queryKey: ["comments", lpId, order],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
        params: {
          page: pageParam,
          limit,
          order,
        },
      });

      return {
        data: res.data.data.data,       // ✅ 댓글 배열
        hasNext: res.data.data.hasNext // ✅ 다음 페이지 존재 여부
      };
    },
    enabled: !!lpId,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.data.length / limit + 1 : undefined),
  });
};

