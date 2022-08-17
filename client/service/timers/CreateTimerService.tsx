import { useState, useCallback } from 'react';
import { useCookies } from 'react-cookie';

import { useHttp } from '../../hooks';
import { baseUrlApi } from '../baseEnv';
import { IServerErrors, IMessageResponse } from '../../types/serviceType';

const useCreateTimer = () => {
    const { loading, request } = useHttp();
    const [cookies] = useCookies(['authData']);

    const [serverErrors, setServerErrors] = useState<IServerErrors[]>([]);
    const [resultMessage, setResultMessage] = useState('');
    const authorization = cookies.authData?.token;

    const createTimer = useCallback(
        async (label: string, total: number): Promise<string> => {
            return request(
                `${baseUrlApi}/timer/create`,
                'POST',
                {
                    label,
                    total,
                },
                {
                    authorization,
                },
            ).then((result: IMessageResponse) => {
                result && result.errors
                    ? setServerErrors(result.errors)
                    : setServerErrors([]);
                setResultMessage(result.message);

                !result &&
                    setServerErrors([
                        {
                            msg: 'Something was wrong',
                            value: 'Something was wrong',
                        },
                    ]);

                return result.message;
            });
        },
        [],
    );

    return {
        createTimer,
        loading,
        serverErrors,
        resultMessage,
    };
};

export { useCreateTimer };
