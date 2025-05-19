import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchUser } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useUpdateUserInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchUser,
    // Optimistic Update 적용
    onMutate: async (newUser) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.myInfo] });
      const previous = queryClient.getQueryData([QUERY_KEY.myInfo]);
      queryClient.setQueryData([QUERY_KEY.myInfo], (old: any) => ({
        ...old,
        data: {
          ...old?.data,
          ...newUser,
        },
      }));
      return { previous };
    },
    onError: (_err, _newUser, context) => {
      if (context?.previous) {
        queryClient.setQueryData([QUERY_KEY.myInfo], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo], exact: true });
    },
  });
}

export default useUpdateUserInfo;