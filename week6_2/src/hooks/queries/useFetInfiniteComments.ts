import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { PAGINATION_ORDER } from "../../enums/common";
import { Key, ReactNode } from "react";

interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

interface CommentsResponse {
  content: ReactNode;
  author: ReactNode;
  id: Key | null | undefined;
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
      const res = await axios.get<CommentsResponse>(
        `/api/lp/${lpId}/comments`,
        {
          params: {
            page: pageParam,
            limit,
            order, // "asc" or "desc"
          },
        }
      );
      return res.data;
    },
    enabled: !!lpId,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasNext ? allPages.length + 1 : undefined;
    },
  });
};
