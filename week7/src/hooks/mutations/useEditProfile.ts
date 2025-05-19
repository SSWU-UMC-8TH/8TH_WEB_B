//mypage 프로필 수정

import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: editProfile,
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["myInfo"] });

      const previousData = queryClient.getQueryData(["myInfo"]);

      queryClient.setQueryData(["myInfo"], (old: any) => ({
        ...old,
        data: {
          ...old.data,
          name: newData.name,
          bio: newData.bio,
        },
      }));

      return { previousData };
    },
    onError: (_err, _newData, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["myInfo"], context.previousData);
      }
    },
    onSuccess: (res) => {
      queryClient.setQueryData(["myInfo"], res);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
    },
  });
};

export default useEditProfile;