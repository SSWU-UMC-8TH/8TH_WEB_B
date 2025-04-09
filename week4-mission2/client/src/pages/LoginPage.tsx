import {useState} from "react";
import { UserSigninInformation, validateSignin } from "../utils/validate";
import useForm from "../hooks/useForm";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {  
    const navigate = useNavigate(); // useNavigate 훅 사용

    const {values, errors, touched, getInputProps} =
        useForm<UserSigninInformation>( {
        initialValue: {
            email: "",
            password: "",
        },
        validate: validateSignin,
    });

    const handleSubmit = () => {};{
        console.log(values);
    };

    //오류가 하나라도 있거나, 입력값이 비어 있으면 버튼을 비활성화 / 다 알맞게 오류 없게 채워지면 버튼 활성화

    const isDisabled =
    Object.values( errors || {}).some((error) => error.length > 0) || //오류가 있으면 true
    Object.values(values).some((value) => value === ""); //입력값이 비어있으면 true

    return (
        <div className="flex flex-col items-center h-full gap-4 mt-20">
            <div className="flex items-center justify-between w-[300px]">
                    <button className="text-lg cursor-pointer"
                    onClick={() => navigate("/")}>
                    &lt; </button>
                    <div className="text-lg">
                    로그인
                    </div>
                    <div className="blank">
                    </div>
            </div>
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
                    type='button' onClick={handleSubmit} disabled={isDisabled}
                    className={`w-full py-3 rounded-md text-lg transition-colors cursor-pointer ${isDisabled
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-pink-300 text-white hover:bg-pink-200"}`}
                >로그인</button>
            </div>
        </div>
    );
};

export default LoginPage;