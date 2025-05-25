import { useAuth } from "../context/AuthContext";
import useForm from "../hooks/useForm";
import { UserSiginInformation, validateSignin } from "../utils/validate";
import { useMutation } from "@tanstack/react-query";

export const LoginPage = () => {
  const { login } = useAuth();

  const { values, getInputProps, errors, touched } = useForm<UserSiginInformation>({
    initialValue: {
      email: "",
      password: "",
    },
    validate: validateSignin,
  });

  // 로그인 useMutation 설정
  const { mutate: loginMutate, isPending } = useMutation({
    mutationFn: login, // login(values) 대신 mutate(values)로 실행
    onSuccess: () => {
      alert("로그인 성공!");
    },
    onError: (error: any) => {
      alert("로그인 실패: " + (error?.response?.data?.message || "다시 시도해주세요."));
    },
  });

  const handleSubmit = () => {
    loginMutate(values);
  };

  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  };

  const isDisabled: boolean =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "") ||
    isPending;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      로그인
      <div className="flex flex-col gap-3">
        <input
          {...getInputProps("email")}
          name="email"
          type={"email"}
          className={`border w-[300px] py-2 px-3 rounded-sm ${
            errors?.email && touched?.email
              ? "border-red-500 bg-red-200"
              : "border-gray-300"
          }`}
          placeholder={"이메일"}
        />
        {errors?.email && touched?.email && (
          <div className="text-red-500 text-sm">{errors.email}</div>
        )}

        <input
          {...getInputProps("password")}
          type={"password"}
          className={`border w-[300px] py-2 px-3 rounded-sm ${
            errors?.password && touched?.password
              ? "border-red-500 bg-red-200"
              : "border-gray-300"
          }`}
          placeholder={"비밀번호"}
        />
        {errors?.password && touched?.password && (
          <div className="text-red-500 text-sm">{errors.password}</div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className="w-full bg-blue-600 text-white py-3 rounded text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
        >
          {isPending ? "로그인 중..." : "로그인"}
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-center gap-4">
            <img
              alt="구글 로고 이미지"
              src="https://lh3.googleusercontent.com/exxMjxadqER4Ie3_TMeBqZfSwNBfL_3tU0Xvn4tJ3_POtw4haXNbIx7OL7v52_DcaBpe=w30"
            />
            <span>구글 로그인</span>
          </div>
        </button>
      </div>
    </div>
  );
};
