import React, { useEffect, FC, useState } from 'react';
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
    const [label, setLabel] = useState('');

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
                        setLabel(result.timer.label);
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
                className={`${Styles.container} ${Styles.container_success_right} ${Styles.no_timers}`}
            >
                <div className={Styles.form_wrapper}>
                    <div
                        className={`${Styles.form_content} ${Styles.no_timers_text_wrapper}`}
                    >
                        <p> You don't have any timers.</p>
                        <p>Create a new timer using the left panel.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`${Styles.container} ${Styles.container_success_right}`}
        >
            <h3 className={Styles.title}>Your last active timer:</h3>
            <div className={Styles.form_wrapper}>
                {label && <h4 className={Styles.form_label}>{label}</h4>}
                <Timer extraChildren={linkBlock} />
            </div>
        </div>
    );
};

export { DisplayLastTimer };
