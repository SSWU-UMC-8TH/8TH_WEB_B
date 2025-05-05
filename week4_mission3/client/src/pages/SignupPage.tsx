import React, { useState } from 'react';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState(''); // 닉네임 상태 추가
    const [isValid, setIsValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(value)) {
            setIsValid(true);
            setErrorMessage('');
        } else {
            setIsValid(false);
            setErrorMessage('올바른 이메일 형식을 입력해주세요.');
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);

        if (value.length < 8) {
            setPasswordError('비밀번호는 8자 이상이어야 합니다.');
        } else {
            setPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmPassword(value);

        if (value !== password) {
            setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
        } else {
            setConfirmPasswordError('');
        }
    };

    const handleNext = () => {
        if (step === 1 && isValid) {
            setStep(2); // 비밀번호 입력 단계로 이동
        } else if (step === 2 && !passwordError && !confirmPasswordError && password.length >= 8) {
            setStep(3); // 닉네임 입력 단계로 이동
        }
    };

    const handleSignup = () => {
        if (nickname.trim() === '') {
            alert('닉네임을 입력해주세요.');
            return;
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            {step === 1 && (
                <>
                    <h2 className="flex items-center justify-center text-lg mb-3">회원가입</h2>
                    <div style={{ marginBottom: '10px' }}>
                        <input
                            type="email"
                            placeholder="이메일을 입력해주세요"
                            value={email}
                            onChange={handleEmailChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '16px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                        />
                        {errorMessage && (
                            <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                                {errorMessage}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={handleNext}
                        disabled={!isValid}
                        style={{
                            width: '100%',
                            padding: '10px',
                            fontSize: '16px',
                            backgroundColor: isValid ? '#4CAF50' : '#ccc',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isValid ? 'pointer' : 'not-allowed',
                        }}
                    >
                        다음
                    </button>
                </>
            )}
            {step === 2 && (
                <>
                    <h2 className="flex items-center justify-center text-lg mb-3">비밀번호 설정</h2>
                    <p style={{ marginBottom: '10px', fontSize: '16px' }}>
                        이메일: <strong>{email}</strong>
                    </p>
                    <div style={{ marginBottom: '10px', position: 'relative' }}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="비밀번호를 입력해주세요"
                            value={password}
                            onChange={handlePasswordChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '16px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            {showPassword ? '👁️' : '︶'}
                        </button>
                        {passwordError && (
                            <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                                {passwordError}
                            </p>
                        )}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <input
                            type="password"
                            placeholder="비밀번호를 다시 한 번 입력해주세요"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '16px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                        />
                        {confirmPasswordError && (
                            <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                                {confirmPasswordError}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={handleNext}
                        disabled={
                            !!passwordError || !!confirmPasswordError || password.length < 8
                        }
                        style={{
                            width: '100%',
                            padding: '10px',
                            fontSize: '16px',
                            backgroundColor:
                                !passwordError && !confirmPasswordError && password.length >= 8
                                    ? '#4CAF50'
                                    : '#ccc',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor:
                                !passwordError && !confirmPasswordError && password.length >= 8
                                    ? 'pointer'
                                    : 'not-allowed',
                        }}
                    >
                        다음
                    </button>
                </>
            )}
            {step === 3 && (
                <>
                    <h2 className="flex items-center justify-center text-lg mb-3">닉네임 설정</h2>
                    <div style={{ marginBottom: '10px' }}>
                        <input
                            type="text"
                            placeholder="닉네임을 입력해주세요"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '16px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                        />
                    </div>
                    <button
                        onClick={handleSignup}
                        style={{
                            width: '100%',
                            padding: '10px',
                            fontSize: '16px',
                            backgroundColor: nickname.trim() ? '#4CAF50' : '#ccc',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: nickname.trim() ? 'pointer' : 'not-allowed',
                        }}
                        disabled={!nickname.trim()}
                    >
                        회원가입 완료
                    </button>
                </>
            )}
        </div>
    );
};

export default SignupPage;