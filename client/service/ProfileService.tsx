import { useState } from 'react';
import useHttp from '../hooks/useHttp';
import { useCookies } from 'react-cookie';

const useProfileService = () => {
    const { loading, request } = useHttp();

    const [serverErrrors, setServerErrors] = useState<
        [] | { msg: string; value: string }[]
    >([]);
    const [resultMessage, setResultMessage] = useState('');
    const [cookies] = useCookies(['authData']);

    const getUserData = async () => {
        try {
            return request('http://localhost:5000/api/profile', 'GET', null, {
                authorization: cookies.authData.token,
            });
        } catch (e) {
            //@ts-ignore
            setServerErrors([e.message]);
        }
    };

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

    const sendUserAvatar = async (avatar: File) => {
        try {
            const reader = new FileReader();
            reader.readAsDataURL(avatar);
            reader.onload = () => {
                const { result: avatar } = reader;

                request(
                    'http://localhost:5000/api/profile/avatar',
                    'POST',
                    {
                        avatar,
                    },
                    {
                        authorization: cookies.authData.token,
                    },
                );
            };
        } catch (e) {
            //@ts-ignore
            setServerErrors([e.message]);
        }
    };

    return {
        getUserData,
        sendUserData,
        sendUserAvatar,
        loading,
        serverErrrors,
        setServerErrors,
        resultMessage,
    };
};

export default useProfileService;
