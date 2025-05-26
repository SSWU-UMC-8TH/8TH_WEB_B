import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { postSignup } from "../apis/auth";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email({message: "올바른 이메일 형식이 아닙니다."}),
  password: z
    .string()
    .min(8,{message:"비밀번호는 8자 이상이어야 합니다."})
    .max(20, {message: "비밀번호는 20자 이하이어야 합니다."}),
  passwordCheck: z
    .string()
    .min(8,{message:"비밀번호는 8자 이상이어야 합니다."})
    .max(20, {message: "비밀번호는 20자 이하이어야 합니다."}),
    name: z.string().min(1,{message: "이름을 입력해주세요."})
})

.refine((data)=> data.password === data.passwordCheck, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ['passwordCheck']
});

type FormFields = z.infer<typeof schema>

export const SignupPage = () => {
  const navigate = useNavigate();
  const {register,handleSubmit,formState:{errors, isSubmitting}} = useForm<FormFields>({
    defaultValues: {
      name: "",
      email: "",
      password:"",
      passwordCheck: "",
    },
    resolver:zodResolver(schema),
    mode: "onBlur"
  });

  const onSubmit: SubmitHandler<FormFields> = async(data)=>{
    const {passwordCheck, ...rest}= data;
    try {
      const response = await postSignup(rest);
      console.log(response);

      // 회원가입 성공 시 로그인 페이지로 이동
      navigate("/login");
    } catch (error: any) {
      alert(error?.message || "회원가입 실패");
    }
  };

  
  return (
    <div className="flex flex-col items-center justify-center h-full text-lg gap-5 ">
      회원가입
        <div className="flex flex-col gap-3">
            <input
                {...register("email")}
                type={"email"} 
                className={`border border-[#ccc] w-[300px] focus:border-[#807bff] py-2 px-3 rounded-sm
                  ${errors?.email?  "border-red-500 bg-red-200": "border-gray-300"}`}
                placeholder={"이메일"}
            />
            {errors.email && <div className={'text-red-500 text-sm'}>{errors.email.message}</div>}

            <input
                {...register("password")}
                type={"password"} 
                className={`border border-[#ccc] w-[300px] focus:border-[#807bff] py-2 px-3 rounded-sm
                  ${errors?.password? "border-red-500 bg-red-200": "border-gray-300"}`}
                placeholder={"비밀번호"}
            />
            {errors.password && <div className={'text-red-500 text-sm'}>{errors.password.message}</div>}

            <input
                {...register("passwordCheck")}
                type={"password"} 
                className={`border border-[#ccc] w-[300px] focus:border-[#807bff] py-2 px-3 rounded-sm
                  ${errors?.passwordCheck? "border-red-500 bg-red-200": "border-gray-300"}`}
                placeholder={"비밀번호 확인"}
            />
            {errors.passwordCheck && <div className={'text-red-500 text-sm'}>{errors.passwordCheck.message}</div>}

            <input
                {...register("name")}
                type={"name"} 
                className={`border border-[#ccc] w-[300px] focus:border-[#807bff] py-2 px-3 rounded-sm
                  ${errors?.password?"border-red-500 bg-red-200": "border-gray-300"}`}
                placeholder={"닉네임"}
            />
            {errors.name && <div className={'text-red-500 text-sm'}>{errors.name.message}</div>}

            <button disabled={isSubmitting} type="button" onClick={handleSubmit(onSubmit)} className="w-full bg-pink-300 text-white hover:bg-pink-200 py-3 rounded md text-lg font-medium transition-colors cursor-pointer disabled:bg-gray-300">회원가입 완료</button>
        </div>
    </div>
  )
}
