import { useCallback } from 'react';
import { useAppDispatch } from '.';
import {
    setLoadingStatus as setUserLoadingStatus,
    setErrorStatus as setUserErrorStatus,
    saveUserTimerList,
} from 'features/user_timers/userTimersSlice';
import { useGetUserTimers } from 'service/timers/GetAllTimersService';

const useRefreshTimers = () => {
    const dispatch = useAppDispatch();
    const { getUserTimers } = useGetUserTimers();

    const refreshTimers = useCallback(async () => {
        dispatch(setUserLoadingStatus(true));
        await getUserTimers().then((result) => {
            if (!result) {
                dispatch(setUserErrorStatus(true));
            } else {
                dispatch(saveUserTimerList(result.timerList));
            }
        });
        dispatch(setUserLoadingStatus(false));
    }, []);

    return { refreshTimers };
};

export { useRefreshTimers };
