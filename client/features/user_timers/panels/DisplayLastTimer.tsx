import React, { useEffect, FC } from 'react';
import Link from 'next/link';

import { Timer } from 'components/timer';
import { useAppSelector, useAppDispatch } from 'hooks';
import { getAuthSelector } from 'features/auth/authSlice';
import { getTimerListSelector } from '../userTimersSlice';
import { useGetCurrentTimer } from 'service/timers/GetSingleTimerService';
import { ITimer } from 'types/timer';
import findLastActiveTimer from 'utils/findLastActiveTimer';
import {
    setLoadingStatus,
    setErrorStatus,
    saveSingleTimer,
} from 'features/current_timer/currentTimerSlice';
import { ErrorPanel } from 'components/ErrorPanel';

import Styles from '../Timers.module.scss';

const DisplayLastTimer: FC = () => {
    const dispatch = useAppDispatch();
    const authStatus = useAppSelector(getAuthSelector);
    const { isLoading: isLoadingAuth, isUserAuth } = authStatus;
    const timersState = useAppSelector(getTimerListSelector);
    const {
        isLoading: isLoadingTimers,
        isError: isErrorTimers,
        timerList,
    } = timersState;

    const { getTimer } = useGetCurrentTimer();

    const linkBlock = (
        <div className={Styles.link_block}>
            <p className={Styles.link_text}>
                You can find all your timers by link below:
            </p>
            <Link href='/all-timers'>
                <a className={Styles.link_link}>All timers</a>
            </Link>
        </div>
    );

    useEffect(() => {
        if (timerList.length) {
            const findLastTimer = findLastActiveTimer(
                timerList,
            ) as ITimer | null;

            findLastTimer &&
                getTimer(findLastTimer._id).then((result) => {
                    if (!result || !result.timer) {
                        dispatch(setErrorStatus(true));
                    } else {
                        dispatch(saveSingleTimer(result.timer));
                    }
                    dispatch(setLoadingStatus(false));
                });
        }
    }, [timerList]);

    if (!isUserAuth || isLoadingAuth || isLoadingTimers) {
        return null;
    }

    if (isErrorTimers) {
        return <ErrorPanel message="Timer wasn't dowloaded" />;
    }

    if (!timerList.length) {
        return (
            <div
                className={`${Styles.form} ${Styles.form_success_right} ${Styles.no_timers}`}
            >
                <p> {`You don't have any timers.`}</p>
                <p>Create a new timer using the left panel.</p>
            </div>
        );
    }

    return (
        <div className={`${Styles.form} ${Styles.form_success_right}`}>
            <Timer
                formTitle='Your last active timer:'
                extraChildren={linkBlock}
            />
        </div>
    );
};

export { DisplayLastTimer };
