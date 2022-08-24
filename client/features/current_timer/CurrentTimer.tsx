import React, { useState, useEffect, FC } from 'react';

import { useAppDispatch, useAppSelector } from 'hooks';
import { getCurrentTimer } from 'features/current_timer/currentTimerSlice';
import { Timer } from 'components/timer';
import { useGetCurrentTimer } from 'service/timers/GetSingleTimerService';
import { Spinner } from 'components/spinner';
import {
    setLoadingStatus,
    setErrorStatus,
    saveSingleTimer,
} from 'features/current_timer/currentTimerSlice';
import { ErrorPanel } from 'components/error_panel';

import Styles from './CurrentTimer.module.scss';

export interface CurrentTimerI {
    routeId?: string;
}

const CurrentTimer: FC<CurrentTimerI> = ({ routeId }) => {
    const dispatch = useAppDispatch();
    const { getTimer } = useGetCurrentTimer();

    const [loadingId, setLoadingId] = useState(true);
    const currentTimer = useAppSelector(getCurrentTimer);
    const { timer, isLoading, isError } = currentTimer;

    const { CurcleSpin } = Spinner();

    useEffect(() => {
        if (!routeId) {
            return setLoadingId(true);
        }

        setLoadingId(false);
        dispatch(setLoadingStatus(true));
        getTimer(routeId).then((result) => {
            if (!result || !result.timer) {
                dispatch(setErrorStatus(true));
            } else {
                dispatch(saveSingleTimer(result.timer));
            }
            dispatch(setLoadingStatus(false));
        });
    }, [routeId]);

    if (isLoading || loadingId) {
        return (
            <div className={Styles.single_container}>
                {CurcleSpin(100, 'rgba(82, 0, 255, 0.9)')}
            </div>
        );
    }

    if (isError || !timer) {
        return <ErrorPanel />;
    }

    return (
        <div
            className={`${Styles.single_container} ${Styles.single_container_timer}`}
        >
            <Timer />
        </div>
    );
};

export { CurrentTimer };
