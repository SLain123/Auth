import { useCallback } from 'react';
import { useCookies } from 'react-cookie';

import { useHttp } from '../../hooks/useHttp';
import { baseUrlApi } from '../baseEnv';

const useGetUserTimers = () => {
    const { request } = useHttp();
    const [cookies] = useCookies(['authData']);

    const authorization = cookies.authData?.token;

    const getUserTimers = useCallback(
        async () =>
            request(`${baseUrlApi}/timer/all`, 'GET', null, {
                authorization,
            }),
        [],
    );

    return {
        getUserTimers,
    };
};

export { useGetUserTimers };
