
import { Comment } from "../types/comment";
import { axiosInstance } from "./axios";

export const postComment = async ({ lpId, content }: { lpId: number; content: string; }): Promise<Comment> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, { content });
  return data.data;
};

export const getComments = async (lpId: number): Promise<Comment[]> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`);
  return data.data; 
};
export const deleteComment = async (commentId: number): Promise<void> => {
  await axiosInstance.delete(`/v1/comments/${commentId}`);
};

export const updateComment = async ({ commentId, content }: { commentId: number; content: string; }): Promise<Comment> => {
  const { data } = await axiosInstance.patch(`/v1/comments/${commentId}`, { content });
  return data.data;
};
