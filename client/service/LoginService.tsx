import { useState, useCallback } from 'react';
import { useCookies } from 'react-cookie';

import { IServerErrors } from '../types/serviceType';
import { useHttp } from '../hooks/useHttp';
import { baseUrlApi } from './baseEnv';

export interface IRequestAuth {
    email: string;
    password: string;
}

export interface IResponseAuth {
    token: string;
    userId: string;
    message: string;
    errors?: IServerErrors[];
}

const useLoginService = () => {
    const { loading, request } = useHttp();
    const [_cookies, setCookie] = useCookies(['authData']);

    const [serverErrors, setServerErrors] = useState<IServerErrors[]>([]);
    const [resultMessage, setResultMessage] = useState('');

    const sendLoginData = useCallback(
        async (values: IRequestAuth): Promise<void> => {
            const { email, password } = values;

            request(`${baseUrlApi}/auth/login`, 'POST', {
                email,
                password,
            }).then((result: IResponseAuth) => {
                result && result.errors
                    ? setServerErrors(result.errors)
                    : setServerErrors([]);
                result && setResultMessage(result.message);
                if (result && result.token) {
                    const { token, userId } = result;
                    setCookie('authData', { userId, token });
                } else setResultMessage('Something was wrong...');
            });
        },
        [],
    );

    return { sendLoginData, loading, serverErrors, resultMessage };
};

export { useLoginService };
