import React, { FC } from 'react';
import Image from 'next/image';
import { useCookies } from 'react-cookie';

import { useControlTimer } from 'service/timers/ControlTimerService';
import { Spinner } from 'components/spinner/Spinner';
import { useAppSelector } from 'hooks';
import { getCurrentTimer } from 'features/current_timer/currentTimerSlice';

import Styles from '../Timer.module.scss';
import playIcon from 'public/icons/play.svg';
import pauseIcon from 'public/icons/pause.svg';

export interface IPlayBtn {
    isActive: boolean;
    changeActiveStatus: (status: boolean) => void;
}

const PlayBtn: FC<IPlayBtn> = ({ isActive, changeActiveStatus }) => {
    const { detailLoading, controlTimer } = useControlTimer();

    const currentTimer = useAppSelector(getCurrentTimer);
    const { timer } = currentTimer;
    const { _id, ownerId } = timer;

    const [cookies] = useCookies(['authData']);
    const isOwner = () =>
        cookies?.authData ? cookies.authData?.userId === ownerId : false;
    const { CurcleSpin } = Spinner();

    return (
        <button
            type='button'
            className={Styles.timer_control_btn}
            disabled={detailLoading.playPause || !isOwner()}
            onClick={() => {
                controlTimer(_id, isActive ? 'pause' : 'play').then((data) => {
                    if (data) data && changeActiveStatus(!isActive);
                });
            }}
        >
            {detailLoading.playPause || detailLoading.reset ? (
                CurcleSpin(21, 'white')
            ) : (
                <Image
                    width={isActive ? 32 : 36}
                    height={isActive ? 36 : 40}
                    src={isActive ? pauseIcon : playIcon}
                    alt='play'
                />
            )}
        </button>
    );
};

export { PlayBtn };
