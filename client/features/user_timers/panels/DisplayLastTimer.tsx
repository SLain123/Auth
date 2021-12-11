import React, { useEffect } from 'react';
import { Timer } from '../../../components/timer';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { getAuthSelector } from '../../auth/authSlice';
import { getTimerListSelector } from '../userTimersSlice';
import Link from 'next/link';
import Button from '@mui/material/Button';
import { useGetCurrentTimer } from '../../../service/TimerService';
import { getCurrentTimer } from '../../../features/current_timer/currentTimerSlice';
import { TimerI } from '../../../types/timer';

import Styles from '../Timers.module.scss';

const DisplayLastTimer: React.FC = () => {
    const authStatus = useAppSelector(getAuthSelector);
    const { isLoading: isLoadingAuth, isUserAuth } = authStatus;

    const timersState = useAppSelector(getTimerListSelector);
    const {
        isLoading: isLoadingTimers,
        isError: isErrorTimers,
        timerList,
    } = timersState;

    const getCurrentTimerService = useGetCurrentTimer();
    const { getTimer } = getCurrentTimerService;

    const currentTimer = useAppSelector(getCurrentTimer);
    const { timer, isLoading, isError } = currentTimer;

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
            getTimer(timerList[timerList.length - 1]._id);
        }
    }, [timerList]);

    if (!isUserAuth || isLoadingAuth || isLoadingTimers || isLoading) {
        return null;
    }

    if (isErrorTimers || isError) {
        return (
            <div className={`${Styles.form} ${Styles.form_with_error}`}>
                <p>{`Timers wasn't dowload`}</p>
                <p>Something was wrong</p>

                <Button
                    className={Styles.create_btn}
                    variant='contained'
                    color='success'
                    size='large'
                    type='button'
                    onClick={() => location.reload()}
                >
                    Refresh page
                </Button>
            </div>
        );
    }

    if (!timerList.length || !timer) {
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
                {...(timer as TimerI)}
                formTitle='Your last active timer:'
                extraChildren={linkBlock}
            />
        </div>
    );
};

export default DisplayLastTimer;
