import { useState } from 'react';
import useHttp from '../hooks/useHttp';
import { useCookies } from 'react-cookie';

const useLoginService = () => {
    const { loading, request } = useHttp();
    const [serverErrrors, setServerErrors] = useState<
        [] | { msg: string; value: string }[]
    >([]);
    const [resultMessage, setResultMessage] = useState('');
    const [cookies, setCookie] = useCookies(['authData']);

    const sendLoginData = async (values: {
        email: string;
        password: string;
    }) => {
        const { email, password } = values;
        try {
            request('http://localhost:5000/api/auth/login', 'POST', {
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

    return { sendLoginData, loading, serverErrrors, resultMessage };
};

export default useLoginService;
