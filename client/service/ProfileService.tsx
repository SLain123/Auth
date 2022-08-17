import { useState, useCallback } from 'react';
import { useCookies } from 'react-cookie';

import { useHttp } from '../hooks/useHttp';
import { baseUrlApi } from './baseEnv';
import { IServerErrors } from '../types/serviceType';

export interface IUserData {
    nickName: string;
    avatar: null | string;
    errors?: IServerErrors[];
}

const useProfileService = () => {
    const { loading, request } = useHttp();
    const [cookies] = useCookies(['authData']);

    const [serverErrors, setServerErrors] = useState<IServerErrors[]>([]);
    const [resultMessage, setResultMessage] = useState('');
    const authorization = cookies.authData?.token;

    const getUserData = useCallback(async (): Promise<IUserData> => {
        return request(`${baseUrlApi}/profile`, 'GET', null, {
            authorization,
        });
    }, []);

    const sendUserData = useCallback(
        async (nickName: string): Promise<void> => {
            request(
                `${baseUrlApi}/profile`,
                'POST',
                {
                    nickName,
                },
                {
                    authorization,
                },
            ).then((result) => {
                result.errors
                    ? setServerErrors(result.errors)
                    : setServerErrors([]);
                setResultMessage(result.message);
            });
        },
        [],
    );

    const sendUserAvatar = useCallback(async (avatar: File): Promise<void> => {
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
                    authorization,
                },
            );
        };
    }, []);

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

export { useProfileService };
