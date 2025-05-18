import { axiosInstance } from "./axios";

export const getPostDetail = async (id: string) => {
  const res = await axiosInstance.get(`/v1/posts/${id}`);
  return res.data.data;
};

export const deletePost = async (id: string) => {
  const res = await axiosInstance.delete(`/v1/posts/${id}`);
  return res.data;
};

export const toggleLikePost = async (id: string) => {
  const res = await axiosInstance.post(`/v1/posts/${id}/like`);
  return res.data.data;
};
