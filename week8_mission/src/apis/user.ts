import { axiosInstance } from "./axios";

export interface UpdateProfileDto {
  name: string;
  bio?: string;
  avatar?: string;
}


export const updateProfile = async (data: FormData) => {
  const response = await axiosInstance.patch("/v1/users", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};



export const deleteUser = async () => {
  const res = await axiosInstance.delete("/v1/users");
  return res.data;
};
