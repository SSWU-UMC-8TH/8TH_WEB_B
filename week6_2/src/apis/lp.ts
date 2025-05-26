import { PaginationDto } from "../types/commons";
import { Lp, ResponseLpListDto } from "../types/lp";
import { axiosInstance } from "./axios";

export const getLpList = async (PaginationDto:PaginationDto): Promise<ResponseLpListDto>=> {
    const {data} = await axiosInstance.get("/v1/lps", {
        params:PaginationDto
    });
    return data;
};

export const getLpDetail = async (id: number): Promise<Lp> => {
    const { data } = await axiosInstance.get(`/v1/lps/${id}`);
    return data;
};