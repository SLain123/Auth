import React from 'react';
import { Timer } from '../../../components/timer';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { getAuthSelector } from '../../auth/authSlice';
import { getTimerListSelector } from '../../timers/timersSlice';
import Link from 'next/link';

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

    return (
        <div>
            {isUserAuth &&
                !isLoadingAuth &&
                !isErrorTimers &&
                timerList.length !== 0 && (
                    <Timer
                        {...timerList[timerList.length - 7]}
                        formTitle='Your last active timer:'
                        extraChildren={linkBlock}
                    />
                )}
        </div>
    );
};

export default DisplayTimersPanel;
