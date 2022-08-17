import { useState, useCallback } from 'react';
import { useCookies } from 'react-cookie';

import { useHttp } from 'hooks';
import { baseUrlApi } from '../baseEnv';
import { IMessageResponse } from 'types/serviceType';

export type timerActions = 'play' | 'pause' | 'reset';

const useControlTimer = () => {
    const { loading, request } = useHttp();
    const [detailLoading, setDetailLoading] = useState({
        playPause: false,
        reset: false,
    });
    const [cookies] = useCookies(['authData']);
    const authorization = cookies.authData?.token;

    const controlTimer = useCallback(
        async (
            timerId: string,
            actOption: timerActions,
        ): Promise<IMessageResponse> => {
            setDetailLoading({
                playPause: actOption === 'reset' ? false : true,
                reset: actOption === 'reset' ? true : false,
            });
            return request(
                `${baseUrlApi}/timer/control`,
                'POST',
                {
                    timerId,
                    actOption,
                },
                {
                    authorization,
                },
            ).then((result) => {
                setDetailLoading({
                    playPause: actOption === 'reset' ? false : loading,
                    reset: actOption === 'reset' ? loading : false,
                });
                return result;
            });
        },
        [],
    );

    return {
        controlTimer,
        detailLoading,
    };
};

export { useControlTimer };
