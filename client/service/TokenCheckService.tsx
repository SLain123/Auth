import { useCallback } from 'react';

import { useHttp } from 'hooks';
import { baseUrlApi } from 'service/baseEnv';
import { IMessageResponse } from 'types/serviceType';

export interface IResponseCheckToken extends IMessageResponse {
    validate: boolean;
}

const useCheckTokenService = () => {
    const { loading, request, error } = useHttp();

    const sendCheckRequest = useCallback(
        async (token: string | null): Promise<IResponseCheckToken> =>
            token &&
            request(`${baseUrlApi}/auth/check`, 'GET', null, {
                authorization: token,
            }),
        [],
    );

    return { sendCheckRequest, loading, error };
};

export { useCheckTokenService };
