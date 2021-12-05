import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { getCurrentTimer } from '../../features/current_timer/currentTimerSlice';
import { Timer } from '../../components/timer';
import { TimerI } from '../../types/timer';
import { useGetCurrentTimer } from '../../service/TimerService';
import { Spinner } from '../../components/spinner';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';

import Styles from './CurrentTimer.module.scss';

export interface CurrentTimerI {
    routeId?: string;
}

const CurrentTimer: React.FC<CurrentTimerI> = ({ routeId }) => {
    const router = useRouter();

    const [loadingId, setLoadingId] = useState(true);
    const currentTimer = useAppSelector(getCurrentTimer);
    const { timer, isLoading, isError } = currentTimer;

    const getCurrentTimerService = useGetCurrentTimer();
    const { getTimer } = getCurrentTimerService;

    const { curcleSpin } = Spinner();

    useEffect(() => {
        if (!routeId) {
            return setLoadingId(true);
        }
        
        setLoadingId(false);
        getTimer(routeId);
    }, [routeId]);

    if (isLoading || loadingId) {
        return (
            <div className={Styles.single_container}>
                {curcleSpin(100, 'green')}
            </div>
        );
    }

    if (isError || !timer) {
        return (
            <div
                className={`${Styles.single_container} ${Styles.single_container_error}`}
            >
                <p className={Styles.single_error_text}>
                    Something was wrong. Please refresh the page.
                </p>
                <Button
                    className={Styles.single_refresh_btn}
                    variant='contained'
                    color='success'
                    size='medium'
                    type='button'
                    onClick={() => {
                        router.reload();
                    }}
                >
                    Refresh page
                </Button>
            </div>
        );
    }

    return (
        <div
            className={`${Styles.single_container} ${Styles.single_container_timer}`}
        >
            <Timer {...(timer as TimerI)} />
        </div>
    );
};

export default CurrentTimer;
