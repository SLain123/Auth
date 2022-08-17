import { useCallback } from 'react';
import { useCookies } from 'react-cookie';

import { useHttp } from 'hooks';
import { baseUrlApi } from '../baseEnv';
import { IMessageResponse } from 'types/serviceType';

const useRemoveTimer = () => {
    const { request } = useHttp();
    const [cookies] = useCookies(['authData']);
    const authorization = cookies.authData?.token;

    const removeTimer = useCallback(
        async (timerId: string): Promise<IMessageResponse> =>
            request(
                `${baseUrlApi}/timer`,
                'DELETE',
                {
                    timerId,
                },
                {
                    authorization,
                },
            ),
        [],
    );

    return {
        removeTimer,
    };
};

export { useRemoveTimer };
