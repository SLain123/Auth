import { useState } from 'react';
import useHttp from '../hooks/useHttp';
import { useCookies } from 'react-cookie';
import { baseUrlApi } from './baseEnv';

const useProfileService = () => {
    const { loading, request } = useHttp();

    const [serverErrors, setServerErrors] = useState<
        [] | { msg: string; value: string }[]
    >([]);
    const [resultMessage, setResultMessage] = useState('');
    const [cookies] = useCookies(['authData']);

    const getUserData = async () => {
        try {
            return request(`${baseUrlApi}/profile`, 'GET', null, {
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
                `${baseUrlApi}/profile`,
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
                    `${baseUrlApi}/profile/avatar`,
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
        serverErrors,
        setServerErrors,
        resultMessage,
    };
};

export default useProfileService;
