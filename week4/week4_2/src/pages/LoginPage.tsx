import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { UserSigninInformation, validateSignin } from "../utils/validate";
import { postSignin } from "../apis/auts";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

// ✅ 구글 로고 import
import googleLogo from "../assets/google-logo.png";

const LoginPage = () => {
  const { setItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
    initialValue: {
      email: "",
      password: "",
    },
    validate: validateSignin,
  });
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await postSignin(values);
      setItem(response.data.accessToken);
      console.log(response);
    } catch (error: any) {
      alert(error?.message);
    }
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      {/* 상단 로그인 타이틀 */}
      <div className="relative w-[300px] flex items-center justify-center h-12 mb-6">
        <button onClick={() => navigate(-1)} className="absolute left-0 text-xl pl-4">
          {"<"}
        </button>
        <h1 className="text-xl font-bold">로그인</h1>
      </div>

      {/* 구글 로그인 버튼 */}
      <button
        onClick={() => console.log("Google login")}
        className="flex items-center justify-center border border-white w-[300px] h-12 rounded-md gap-2 hover:bg-white hover:text-black transition-colors"
      >
        <img
          src={googleLogo}
          alt="google"
          className="w-5 h-5"
        />
        구글 로그인
      </button>

      {/* OR 구분선 */}
      <div className="my-4 flex items-center w-[300px]">
        <hr className="flex-grow border-gray-500" />
        <span className="px-2 text-gray-500 text-sm">OR</span>
        <hr className="flex-grow border-gray-500" />
      </div>

      {/* 이메일/비밀번호 입력 폼 */}
      <div className="flex flex-col gap-3">
        <input
          {...getInputProps("email")}
          className={`border w-[300px] p-[10px] rounded-sm bg-black text-white placeholder-gray-400 focus:border-[#807bff] ${
            errors?.email && touched?.email ? "border-sky-500 bg-sky-100 text-black" : "border-gray-300"
          }`}
          type="email"
          placeholder="이메일을 입력해주세요!"
        />
        {errors?.email && touched?.email && (
          <div className="text-red-500 text-sm">{errors.email}</div>
        )}

        <input
          {...getInputProps("password")}
          className={`border w-[300px] p-[10px] rounded-sm bg-black text-white placeholder-gray-400 focus:border-[#807bff] ${
            errors?.password && touched?.password ? "border-sky-500 bg-sky-100 text-black" : "border-gray-300"
          }`}
          type="password"
          placeholder="비밀번호를 입력해주세요!"
        />
        {errors?.password && touched?.password && (
          <div className="text-red-500 text-sm">{errors.password}</div>
        )}

        <button
          className="w-full bg-[#1a1a1a] text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-600"
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
