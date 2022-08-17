import { useCallback } from 'react';
import { useCookies } from 'react-cookie';

import { useHttp } from 'hooks';
import { baseUrlApi } from '../baseEnv';
import { IResponseTimer } from 'types/serviceType';

const useChangeTimer = () => {
    const { request } = useHttp();
    const [cookies] = useCookies(['authData']);
    const authorization = cookies.authData?.token;

    const changeTimer = useCallback(
        async (
            timerId: string,
            label: string,
            total: number,
        ): Promise<IResponseTimer> =>
            request(
                `${baseUrlApi}/timer/change`,
                'POST',
                {
                    timerId,
                    label,
                    total,
                },
                {
                    authorization,
                },
            ),
        [],
    );
    return {
        changeTimer,
    };
};

export { useChangeTimer };
