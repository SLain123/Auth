import { useState } from 'react';
import useHttp from '../hooks/useHttp';
import { useCookies } from 'react-cookie';
import { useAppDispatch } from '../hooks/useAppDispatch';
import {
    setLoadingStatus,
    setErrorStatus,
    saveTimerList,
} from '../features/timers/timersSlice';

export const useGetUserTimers = () => {
    const { loading, request } = useHttp();
    const [cookies] = useCookies(['authData']);
    const dispatch = useAppDispatch();

    const getTimers = async () => {
        try {
            request('http://localhost:5000/api/timer', 'GET', null, {
                authorization: cookies.authData.token,
            }).then((data) => {
                if (!data) {
                    dispatch(setErrorStatus(true));
                } else {
                    dispatch(saveTimerList(data.timerList));
                }
                dispatch(setLoadingStatus(loading));
            });
        } catch (e) {
            //@ts-ignore
            dispatch(setErrorStatus(true));
            dispatch(setLoadingStatus(loading));
        }
    };

    return {
        getTimers,
    };
};

export const useCreateTimer = () => {
    const { loading, request } = useHttp();
    const { getTimers } = useGetUserTimers();

    const [serverErrors, setServerErrors] = useState<
        [] | { msg: string; value: string }[]
    >([]);
    const [resultMessage, setResultMessage] = useState('');
    const [cookies] = useCookies(['authData']);

    const createTimer = async (label: string, total: number) => {
        try {
            request(
                'http://localhost:5000/api/timer',
                'POST',
                {
                    label,
                    total,
                },
                {
                    authorization: cookies.authData.token,
                },
            ).then((data) => {
                data.errors
                    ? setServerErrors(data.errors)
                    : setServerErrors([]);
                setResultMessage(data.message);

                getTimers();
            });
        } catch (e) {
            //@ts-ignore
            setServerErrors([e.message]);
        }
    };

    return {
        createTimer,
        loading,
        serverErrors,
        resultMessage,
    };
};

export const useControlTimer = () => {
    const { loading, request } = useHttp();
    const [detailLoading, setDetailLoading] = useState({
        playPause: false,
        reset: false,
    });
    const [cookies] = useCookies(['authData']);

    const controlTimer = async (
        timerId: string,
        actOption: 'play' | 'pause' | 'reset',
    ) => {
        try {
            setDetailLoading({
                playPause: actOption === 'reset' ? false : true,
                reset: actOption === 'reset' ? true : false,
            });
            return request(
                'http://localhost:5000/api/timer/control',
                'POST',
                {
                    timerId,
                    actOption,
                },
                {
                    authorization: cookies.authData.token,
                },
            ).then((data) => {
                setDetailLoading({
                    playPause: actOption === 'reset' ? false : loading,
                    reset: actOption === 'reset' ? loading : false,
                });
                return data;
            });
        } catch (e) {
            setDetailLoading({
                playPause: actOption === 'reset' ? false : loading,
                reset: actOption === 'reset' ? loading : false,
            });
            console.log(e);
        }
    };

    return {
        controlTimer,
        detailLoading,
    };
};
