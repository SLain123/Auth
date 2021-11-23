import { useState } from 'react';
import useHttp from '../hooks/useHttp';
import { useCookies } from 'react-cookie';
import { useAppDispatch } from '../hooks/useAppDispatch';
import {
    setLoadingStatus,
    setErrorStatus,
    saveTimerList,
} from '../features/timers/timersSlice';

export const useCreateTimer = () => {
    const { loading, request } = useHttp();

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
