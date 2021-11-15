import { useState } from 'react';
import useHttp from '../hooks/useHttp';

const useRegisterService = () => {
    const { loading, request } = useHttp();
    const [serverErrrors, setServerErrors] = useState<
        [] | { msg: string; value: string }[]
    >([]);
    const [resultMessage, setResultMessage] = useState('');

    const sendRegisterData = async (values: {
        email: string;
        password: string;
        nickName: string;
    }) => {
        const { email, password, nickName } = values;
        try {
            request('http://localhost:5000/api/auth/register', 'POST', {
                email,
                password,
                nickName,
            }).then((data) => {
                data.errors
                    ? setServerErrors(data.errors)
                    : setServerErrors([]);
                setResultMessage(data.message);
            });
        } catch (e) {
            //@ts-ignore
            setServerErrors([e.message]);
        }
    };

    return { sendRegisterData, loading, serverErrrors, resultMessage };
};

export default useRegisterService;
