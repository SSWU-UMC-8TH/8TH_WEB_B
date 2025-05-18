import { PaginationDto } from "../types/commons";
import { Lp, ResponseLpListDto } from "../types/lp";
import { axiosInstance } from "./axios";

export const getLpList = async (PaginationDto:PaginationDto): Promise<ResponseLpListDto>=> {
    const {data} = await axiosInstance.get("/v1/lps", {
        params:PaginationDto
    });
    return data;
};

//Lp 상세 조회
export const getLpDetail = async (id: number): Promise<Lp> => {
    const { data } = await axiosInstance.get(`/v1/lps/${id}`);
    return data;
};

// LP 등록
export const postLp = async (userId: number, formData: FormData): Promise<void> => {
  await axiosInstance.post(`/v1/lps/user/${userId}`, formData);
};

//좋아요
export const likeLp = async (id: number) => {
  const { data } = await axiosInstance.post(`/v1/lps/${id}/likes`);
  return data;
};

export const unlikeLp = async (id: number) => {
  return axiosInstance.delete(`/v1/lps/${id}/likes`);
};