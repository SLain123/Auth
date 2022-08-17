import { useCallback } from 'react';

import { useHttp } from 'hooks';
import { baseUrlApi } from '../baseEnv';
import { IResponseTimer } from 'types/serviceType';

const useGetCurrentTimer = () => {
    const { request } = useHttp();

    const getTimer = useCallback(
        async (timerId: string): Promise<IResponseTimer> =>
            request(`${baseUrlApi}/timer`, 'POST', {
                timerId,
            }),
        [],
    );

    return {
        getTimer,
    };
};

export { useGetCurrentTimer };
