import { postSignin } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import useForm from "../hooks/useForm"
import { useLocalStorage } from "../hooks/useLocalStorage";
import { UserSiginInformation, validateSignin } from "../utils/validate"

export const LoginPage = () => {
    const {setItem} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken)
    const {values, getInputProps, errors, touched} = useForm<UserSiginInformation>({
        initialValue: {
            email:"",
            password:"",
        },
        validate:validateSignin,

    });


    const handleSubmit = async () => {
        console.log(values);
        try {
            const response = await postSignin(values);
            setItem(response.data.accessToken)
            alert("로그인 성공!");
        }catch (error:any) {
            alert(error?.message || "로그인 실패")
        }  
       

       
    };

    const isDisabled:boolean =
        Object.values(errors || {}).some((error) => error.length > 0) ||
        Object.values(values).some((value) => value === "");

    return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
        로그인
        <div className="flex flex-col gap-3">
            <input
                {...getInputProps("email")}
                name="email"
                type={"email"} 
                className={`border border-[#ccc] w-[300px] focus:border-[#807bff] py-2 px-3 rounded-sm ${errors?.email && touched?.email ? "border-red-500 bg-red-200": "border-gray-300"}`}
                placeholder={"이메일"}
            />
            {errors?.email && touched?.email && (
                <div className="text-red-500 text-sm">{errors.email}</div>
            )}

            <input
                {...getInputProps("password")}
                type={"password"} 
                className={`border border-[#ccc] w-[300px] focus:border-[#807bff] py-2 px-3 rounded-sm ${errors?.password && touched?.password ? "border-red-500 bg-red-200": "border-gray-300"}`}
                placeholder={"비밀번호"}
            />
             {errors?.password && touched?.password && (
                <div className="text-red-500 text-sm">{errors.password}</div>
            )}
            <button type="button" onClick={handleSubmit} disabled={isDisabled} className="w-full bg-blue-600 text-white py-3 rounded md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300">로그인</button>
        </div>
    </div>
    )
}
