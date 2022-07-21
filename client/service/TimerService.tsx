import { useState } from 'react';
import useHttp from '../hooks/useHttp';
import { useCookies } from 'react-cookie';
import { useAppDispatch } from '../hooks/useAppDispatch';
import {
    setLoadingStatus as setUserLoadingStatus,
    setErrorStatus as setUserErrorStatus,
    saveUserTimerList,
} from '../features/user_timers/userTimersSlice';
import {
    setLoadingStatus,
    setErrorStatus,
    saveSingleTimer,
} from '../features/current_timer/currentTimerSlice';
import { baseUrlApi } from './baseEnv';

// Get single timer;
export const useGetCurrentTimer = () => {
    const { request } = useHttp();
    const dispatch = useAppDispatch();

    const getTimer = async (timerId: string) => {
        try {
            dispatch(setLoadingStatus(true));
            request(`${baseUrlApi}/timer`, 'POST', {
                timerId,
            }).then((data) => {
                if (!data || !data.timer) {
                    dispatch(setErrorStatus(true));
                } else {
                    dispatch(saveSingleTimer(data.timer));
                }
                dispatch(setLoadingStatus(false));
            });
        } catch (e) {
            //@ts-ignore
            dispatch(setErrorStatus(true));
            dispatch(setLoadingStatus(false));
        }
    };

    return {
        getTimer,
    };
};

// All user timers;
export const useGetUserTimers = () => {
    const { loading, request } = useHttp();
    const [cookies] = useCookies(['authData']);
    const dispatch = useAppDispatch();

    const getUserTimers = async () => {
        try {
            request(`${baseUrlApi}/timer/all`, 'GET', null, {
                authorization: cookies.authData.token,
            }).then((data) => {
                if (!data) {
                    dispatch(setUserErrorStatus(true));
                } else {
                    dispatch(saveUserTimerList(data.timerList));
                }
                dispatch(setUserLoadingStatus(loading));
            });
        } catch (e) {
            //@ts-ignore
            dispatch(setErrorStatus(true));
            dispatch(setUserLoadingStatus(loading));
        }
    };

    return {
        getUserTimers,
    };
};

// Create timer;
export const useCreateTimer = () => {
    const { loading, request } = useHttp();
    const { getUserTimers } = useGetUserTimers();

    const [serverErrors, setServerErrors] = useState<
        [] | { msg: string; value: string }[]
    >([]);
    const [resultMessage, setResultMessage] = useState('');
    const [cookies] = useCookies(['authData']);

    const createTimer = async (label: string, total: number) => {
        try {
            request(
                `${baseUrlApi}/timer/create`,
                'POST',
                {
                    label,
                    total,
                },
                {
                    authorization: cookies.authData.token,
                },
            ).then((data) => {
                data && data.errors
                    ? setServerErrors(data.errors)
                    : setServerErrors([]);
                setResultMessage(data.message);

                !data &&
                    setServerErrors([
                        {
                            msg: 'Something was wrong',
                            value: 'Something was wrong',
                        },
                    ]);

                getUserTimers();
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

// Control timer;
export const useControlTimer = () => {
    const { loading, request } = useHttp();
    const [detailLoading, setDetailLoading] = useState({
        playPause: false,
        reset: false,
    });
    const [cookies] = useCookies(['authData']);

    // const { getUserTimers } = useGetUserTimers();

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
                `${baseUrlApi}/timer/control`,
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

                // getUserTimers();
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

// Edit timer;
export const useChangeTimer = () => {
    const { loading, request } = useHttp();
    const [serverErrors, setServerErrors] = useState<
        [] | { msg: string; value: string }[]
    >([]);
    const [resultMessage, setResultMessage] = useState('');
    const [cookies] = useCookies(['authData']);
    const dispatch = useAppDispatch();

    const { getUserTimers } = useGetUserTimers();
    const { getTimer } = useGetCurrentTimer();

    const changeTimer = async (
        timerId: string,
        label: string,
        total: number,
    ) => {
        try {
            request(
                `${baseUrlApi}/timer/change`,
                'POST',
                {
                    timerId,
                    label,
                    total,
                },
                {
                    authorization: cookies.authData.token,
                },
            ).then((data) => {
                data && data.errors && setServerErrors(data.errors);
                if (data && data.message && data.timer) {
                    setResultMessage(data.message);
                    dispatch(saveSingleTimer(data.timer));
                    getUserTimers();

                    setTimeout(() => setResultMessage(''), 3000);
                }
                !data &&
                    setServerErrors([
                        {
                            msg: 'Something was wrong',
                            value: 'Something was wrong',
                        },
                    ]);
            });
        } catch (e) {
            //@ts-ignore
            setServerErrors([e.message]);
        }
    };

    return {
        changeTimer,
        loading,
        serverErrors,
        resultMessage,
    };
};

// Remove timer;
export const useRemoveTimer = () => {
    const { loading, request } = useHttp();
    const [serverErrors, setServerErrors] = useState<
        [] | { msg: string; value: string }[]
    >([]);
    const [resultMessage, setResultMessage] = useState('');
    const [cookies] = useCookies(['authData']);

    const { getUserTimers } = useGetUserTimers();

    const removeTimer = async (timerId: string) => {
        try {
            request(
                `${baseUrlApi}/timer`,
                'DELETE',
                {
                    timerId,
                },
                {
                    authorization: cookies.authData.token,
                },
            ).then((data) => {
                data && data.errors && setServerErrors(data.errors);
                if (data && data.message) {
                    setResultMessage(data.message);
                    getUserTimers();
                }

                !data &&
                    setServerErrors([
                        {
                            msg: 'Something was wrong',
                            value: 'Something was wrong',
                        },
                    ]);
            });
        } catch (e) {
            //@ts-ignore
            setServerErrors([e.message]);
        }
    };

    return {
        removeTimer,
        loading,
        serverErrors,
        resultMessage,
    };
};
