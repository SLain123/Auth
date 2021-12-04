import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { Timer } from '../../components/timer';
import { TimerI } from '../../types/timer';
import { useGetSingleTimer } from '../../service/TimerService';
import { getTimerListSelector } from '../../features/single_timer/singleTimerSlice';
import { Spinner } from '../../components/spinner';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';

import Styles from './SingleTimer.module.scss';

export interface SingleTimerI {
    routeId?: string | string[];
}

const SingleTimer: React.FC<SingleTimerI> = ({ routeId }) => {
    const router = useRouter();

    const allTimers = useAppSelector(getTimerListSelector);
    const {
        isLoading: isLoadingTimers,
        isError: isErrorTimers,
        timerList,
    } = allTimers;

    const [currentTimer, setCurrentTimer] = useState<TimerI | null>(null);
    const [loading, setLoading] = useState(true);

    const getSingleTimerService = useGetSingleTimer();
    const { getTimer } = getSingleTimerService;

    const { curcleSpin } = Spinner();

    useEffect(() => {
        if (!routeId) {
            return setLoading(true);
        }

        if (isErrorTimers) {
            return setLoading(false);
        }

        if (timerList.length) {
            const findTimer = timerList.filter(({ _id }) => _id === routeId);

            if (findTimer.length) {
                setCurrentTimer(findTimer[0]);
                setLoading(false);
            } else {
                getTimer(routeId as string);
            }
        } else {
            getTimer(routeId as string);
        }
    }, [routeId, allTimers]);

    if (loading || isLoadingTimers) {
        return <div>{curcleSpin(100, 'green')}</div>;
    }

    if (isErrorTimers) {
        return (
            <div>
                <p>
                    Something was wrong. Please refresh the page.
                    <Button
                        className={Styles.refresh_btn}
                        variant='contained'
                        color='success'
                        size='small'
                        type='button'
                        onClick={() => {
                            router.reload();
                        }}
                    >
                        Remove this timer
                    </Button>
                </p>
            </div>
        );
    }

    return <Timer {...(currentTimer as TimerI)} />;
};

export default SingleTimer;
