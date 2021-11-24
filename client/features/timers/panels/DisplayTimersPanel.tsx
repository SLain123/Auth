import React from 'react';
import { Timer } from '../../../components/timer';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { getAuthSelector } from '../../auth/authSlice';
import { getTimerListSelector } from '../../timers/timersSlice';
import Link from 'next/link';
import Button from '@mui/material/Button';

import Styles from '../Timers.module.scss';

const DisplayTimersPanel: React.FC = () => {
    const authStatus = useAppSelector(getAuthSelector);
    const { isLoading: isLoadingAuth, isUserAuth } = authStatus;

    const timersState = useAppSelector(getTimerListSelector);
    const {
        isLoading: isLoadingTimers,
        isError: isErrorTimers,
        timerList,
    } = timersState;

    const linkBlock = (
        <div className={Styles.link_block}>
            <p className={Styles.link_text}>
                You can find all your timers by link below:
            </p>
            <Link href='/timers'>
                <a className={Styles.link_link}>All timers</a>
            </Link>
        </div>
    );

    if (!isUserAuth || isLoadingAuth || isLoadingTimers) {
        return null;
    }

    if (isErrorTimers) {
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
                {...timerList[timerList.length - 1]}
                formTitle='Your last active timer:'
                extraChildren={linkBlock}
            />
        </div>
    );
};

export default DisplayTimersPanel;
