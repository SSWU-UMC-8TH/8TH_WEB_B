import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function useLogoutMutation() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      navigate("/");
    },
    onError: (error) => {
      console.error("로그아웃 실패:", error);
    },
  });
}