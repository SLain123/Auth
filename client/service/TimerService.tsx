import { useState } from 'react';
import useHttp from '../hooks/useHttp';
import { useCookies } from 'react-cookie';

const useProfileService = () => {
    const { loading, request } = useHttp();

    const [serverErrors, setServerErrors] = useState<
        [] | { msg: string; value: string }[]
    >([]);
    const [resultMessage, setResultMessage] = useState('');
    const [cookies] = useCookies(['authData']);

    const sendUserData = async (values: { nickName: string }) => {
        const { nickName } = values;
        try {
            request(
                'http://localhost:5000/api/profile',
                'POST',
                {
                    nickName,
                },
                {
                    authorization: cookies.authData.token,
                },
            ).then((data) => {
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
        setServerErrors,
        resultMessage,
    };
};

export default useProfileService;
