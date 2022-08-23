import { useState, useCallback } from 'react';

import { useHttp } from 'hooks';
import { baseUrlApi } from './baseEnv';
import { IServerErrors } from 'types/serviceType';

export interface IRequestReg {
    email: string;
    password: string;
    nickName: string;
}

const useRegisterService = () => {
    const { loading, request } = useHttp();
    const [serverErrors, setServerErrors] = useState<IServerErrors[]>([]);
    const [resultMessage, setResultMessage] = useState('');

    const sendRegisterData = useCallback(
        async (values: IRequestReg): Promise<void> => {
            const { email, password, nickName } = values;

            request(`${baseUrlApi}/auth/register`, 'POST', {
                email,
                password,
                nickName,
            }).then((data) => {
                data?.errors
                    ? setServerErrors(data.errors)
                    : setServerErrors([]);
                data?.message && setResultMessage(data.message);
            });
        },
        [],
    );

    return { sendRegisterData, loading, serverErrors, resultMessage };
};

export { useRegisterService };
