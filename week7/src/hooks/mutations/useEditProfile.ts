import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../apis/axios";

interface EditProfileParams {
  name: string;
  bio: string;
  profileImg?: File | null;
}

const editProfile = async ({ name, bio, profileImg }: EditProfileParams) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("bio", bio);
  if (profileImg) formData.append("profileImage", profileImg);
  const res = await axiosInstance.patch(`/v1/users`, formData);
  return res.data;
};

const useEditProfile = () => {
  return useMutation({
    mutationFn: editProfile,
  });
};

export default useEditProfile;