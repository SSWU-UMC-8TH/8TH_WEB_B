import { ChangeEvent, useEffect, useState } from "react";

interface UseFormProps<T> {
  initialValue: T; // 입력값 예 - { email: '', password: '' }
  // 값이 올바른지 검증하는 함수
  validate: (values: T) => Record<keyof T, string>; // T에 대한 키 값을 받고 그에 대한 value는 string이다. 
}

function useForm<T>({ initialValue, validate }: UseFormProps<T>) {
  const [values, setValues] = useState(initialValue); 
  const [touched, setTouched] = useState<Record<string, boolean>>(); // 키 값은 string, value 값은 boolean 
  const [errors, setErrors] = useState<Record<string, string>>(); // ex) 이메일은 반드시 @를 포함해야 합니다.

  const handleChange = (name: keyof T, text: string) => {
    setValues({
      ...values, // 불변성 유지 (기존 값 유지)
      [name]: text,   
    });
  };

  const handleBlur = (name: keyof T) => { // 인풋을 클릭했을 때 & 에러가 났을 때 에러메세지를 띄우도록
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  // 이메일 인풋, 패스워드 인풋 속성들을 가져오기
  const getInputProps = (name: keyof T) => {
    const value = values[name];
    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleChange(name, e.target.value);

    const onBlur = () => handleBlur(name);

    return { value, onChange, onBlur }
  };

  // values가 변경될 때마다 에러 검증 로직이 실행됨.
  // { email: "이메일 형식이 아닙니다." }
  useEffect(() => {
    const newErrors = validate(values);
    setErrors(newErrors); // 오류 메세지 업데이트
  }, [validate, values]);

  return { values, errors, touched, getInputProps };
}

export default useForm;