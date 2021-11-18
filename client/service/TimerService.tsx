import { useState } from 'react';
import useHttp from '../hooks/useHttp';
import { useCookies } from 'react-cookie';

export const useCreateTimer = () => {
    const { loading, request } = useHttp();

    const [serverErrors, setServerErrors] = useState<
        [] | { msg: string; value: string }[]
    >([]);
    const [resultMessage, setResultMessage] = useState('');
    const [cookies] = useCookies(['authData']);

    const sendUserData = async (label: string, total: number) => {
        try {
            request(
                'http://localhost:5000/api/timer',
                'POST',
                {
                    label,
                    total,
                },
                {
                    authorization: cookies.authData.token,
                },
            ).then((data) => {
                console.log(data, 'answer');
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

    return {
        sendUserData,
        loading,
        serverErrors,
        resultMessage,
    };
};
