import React, { FC } from 'react';
import Image from 'next/image';
import { useCookies } from 'react-cookie';

import { useControlTimer } from 'service/timers/ControlTimerService';
import { Spinner } from 'components/spinner/Spinner';
import { useAppSelector } from 'hooks';
import { getCurrentTimer } from 'features/current_timer/currentTimerSlice';

import Styles from '../Timer.module.scss';
import stopIcon from 'public/icons/stop.svg';

export interface IPlayBtn {
    changeTime: (time: number) => void;
    changeActiveStatus: (status: boolean) => void;
}

const StopBtn: FC<IPlayBtn> = ({ changeTime, changeActiveStatus }) => {
    const { detailLoading, controlTimer } = useControlTimer();

    const currentTimer = useAppSelector(getCurrentTimer);
    const { timer } = currentTimer;
    const { _id, ownerId, total } = timer;

    const [cookies] = useCookies(['authData']);
    const isOwner = () =>
        cookies?.authData ? cookies.authData?.userId === ownerId : false;
    const { curcleSpin } = Spinner();

    return (
        <button
            type='button'
            className={Styles.timer_control_btn}
            disabled={detailLoading.reset || !isOwner()}
            onClick={() => {
                controlTimer(_id, 'reset').then((data) => {
                    if (data) {
                        changeActiveStatus(false);
                        changeTime(total);
                    }
                });
            }}
        >
            {detailLoading.reset ? (
                curcleSpin(21, 'white')
            ) : (
                <Image width={30} height={30} src={stopIcon} alt='stop' />
            )}
        </button>
    );
};

export { StopBtn };
