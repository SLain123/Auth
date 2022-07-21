import { useState } from 'react';
import useHttp from '../hooks/useHttp';
import { baseUrlApi } from './baseEnv';

const useRegisterService = () => {
    const { loading, request } = useHttp();
    const [serverErrors, setServerErrors] = useState<
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
            request(`${baseUrlApi}/auth/register`, 'POST', {
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

    return { sendRegisterData, loading, serverErrors, resultMessage };
};

export default useRegisterService;
