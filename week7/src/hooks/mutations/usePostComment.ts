////LPDetail에서 댓글 달기

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key";
import { PAGINATION_ORDER } from "../../enums/common";
import { axiosInstance } from "../../apis/axios";

interface PostCommentParams {
    lpId: number;
    content: string;
    order?: PAGINATION_ORDER;
}

const postComment = async ({ lpId, content }: PostCommentParams) => {
const response = await axiosInstance.post(`/v1/lps/${lpId}/comments`, { content });
return response.data;
};

const usePostComment = () => {
const queryClient = useQueryClient();

return useMutation({
mutationFn: postComment,
onSuccess: (_data, variables) => {
    
queryClient.invalidateQueries({
queryKey: [QUERY_KEY.lps, variables.lpId, variables.order ?? PAGINATION_ORDER.desc],});
},});
};

export default usePostComment