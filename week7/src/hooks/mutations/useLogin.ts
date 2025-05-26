import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { UserSigninInformation } from "../../utils/validate";
// 로그인 useMutation
export function useLoginMutation() {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async (data: UserSigninInformation) => {
            return await login(data);
        },
        onSuccess: () => {
            alert("로그인 성공!");
            setTimeout(() => {
                navigate("/my");
            }, 0);
        },
        onError: (error) => {
            console.error("로그인 실패:", error);
            alert("로그인 실패! 이메일 또는 비밀번호를 확인하세요.");
        },
    });
}

function login(data: UserSigninInformation): any {
    throw new Error("Function not implemented.");
}

