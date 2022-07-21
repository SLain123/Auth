import { useState } from 'react';
import useHttp from '../hooks/useHttp';
import { useCookies } from 'react-cookie';
import { baseUrlApi } from './baseEnv';

const useLoginService = () => {
    const { loading, request } = useHttp();
    const [serverErrors, setServerErrors] = useState<
        [] | { msg: string; value: string }[]
    >([]);
    const [resultMessage, setResultMessage] = useState('');
    const [_cookies, setCookie] = useCookies(['authData']);

    const sendLoginData = async (values: {
        email: string;
        password: string;
    }) => {
        const { email, password } = values;
        try {
            request(`${baseUrlApi}/auth/login`, 'POST', {
                email,
                password,
            }).then((data) => {
                data && data.errors
                    ? setServerErrors(data.errors)
                    : setServerErrors([]);
                data && setResultMessage(data.message);
                if (data && data.token) {
                    const { token, userId } = data;
                    setCookie('authData', { userId, token });
                } else setResultMessage('Something was wrong...');
            });
        } catch (e) {
            //@ts-ignore
            setServerErrors([e.message]);
        }
    };

    return { sendLoginData, loading, serverErrors, resultMessage };
};

export default useLoginService;
