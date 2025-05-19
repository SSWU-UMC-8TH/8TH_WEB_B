import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm"
import { UserSigninInformation, validateSignin } from "../utils/validate"
import { useLoginMutation } from "../hooks/mutations/useLogin";

export const LoginPage = () => {
    const navigate = useNavigate();

    const { values, errors, touched, getInputProps } =
        useForm<UserSigninInformation>( {
        initialValue: {
            email: "",
            password: "",
        },
        validate: validateSignin,
    });

    // 로그인 useMutation
     const mutation = useLoginMutation();

    const handleSubmit = () => {
        mutation.mutate({
            email: values.email,
            password: values.password,
        });
    };

    const handleGoogleLogin=()=> {
        window.location.href = `${import.meta.env.VITE_SERVER_API_URL}/v1/auth/google/login?prompt=select_account`;
    }
    
    //오류가 하나라도 있거나, 입력값이 비어 있으면 버튼을 비활성화 / 다 알맞게 오류 없게 채워지면 버튼 활성화
    const isDisabled:boolean =
        Object.values(errors || {}).some((error) => error.length > 0) || //오류가 있으면 true
        Object.values(values).some((value) => value === ""); //입력값이 비어있으면 true

    return (
    <div className="flex flex-col items-center justify-center h-full gap-4 mt-20 text-lg">
        로그인
        <div className="flex flex-col gap-3">
            <input
                {...getInputProps("email")}
                className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff]
            ${errors?.email && touched?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                type={"email"}
                placeholder={"이메일"} />
            {errors?.email && touched?.email && (<div className="text-red-500 text-sm">{errors.email}</div>)}
            <input
                {...getInputProps("password")}
                className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff]
            ${errors?.password && touched?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                type={"password"}
                placeholder={"비밀번호"} />
            {errors?.password && touched?.password && (<div className="text-red-500 text-sm">{errors.password}</div>)}
            <button
                type='button' onClick={handleSubmit} disabled={isDisabled || mutation.isPending}
                className={`w-full py-3 rounded-md text-lg transition-colors cursor-pointer ${isDisabled || mutation.isPending
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-pink-300 text-white hover:bg-pink-200"}`}
            >{mutation.isPending ? "로그인 중..." : "로그인"}</button>

            <button
                type="button" onClick={handleGoogleLogin}  className="w-full bg-gray-700 text-white py-3 rounded md text-lg font-medium hover:bg-gray-500 transition-colors cursor-pointer disabled:bg-gray-300">
                    <div className="flex items-center justify-center gap-4">
                        <img src="/google.png" alt="구글 로고 이미지" className="w-6 h-6"/>
                        <span>구글 로그인</span>
                    </div>
            </button>
        </div>
    </div>
    )
}
