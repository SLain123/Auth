import React, { useState, useEffect } from 'react';
import { convertFromMilliSeconds } from '../../utils/timeConverter';
import Image from 'next/image';
import { useControlTimer } from '../../service/TimerService';
import { TimerI } from '../../types/timer';
import Spinner from '../spinner/Spinner';

import Styles from './Timer.module.scss';
import playIcon from '../../public/icons/play.svg';
import pauseIcon from '../../public/icons/pause.svg';
import stopIcon from '../../public/icons/stop.svg';
import editIcon from '../../public/icons/edit.svg';

export interface TimerPropsI extends TimerI {
    formTitle?: string;
    extraChildren?: string | React.ReactElement | React.ReactNode;
}

const Timer: React.FC<TimerPropsI> = ({
    _id,
    label,
    total,
    timeToEnd,
    restTime,
    formTitle,
    extraChildren,
}) => {
    const [isActive, setActive] = useState(Boolean(timeToEnd));
    const [time, setTime] = useState(
        restTime
            ? restTime
            : timeToEnd
            ? new Date(timeToEnd).getTime() - new Date().getTime()
            : total,
    );
    const { hour, minute, second } = convertFromMilliSeconds(time);

    const controlTimerService = useControlTimer();
    const { detailLoading, controlTimer } = controlTimerService;

    const { curcleSpin } = Spinner();

    useEffect(() => {
        const timer = setInterval(() => isActive && setTime(time - 1000), 1000);

        return () => clearInterval(timer);
    }, [time, isActive]);

    return (
        <div>
            <h3 className={Styles.timer_title}>{formTitle}</h3>
            <p className={Styles.timer_label}>{label}</p>
            <div className={Styles.timer_time_container}>
                <span className={Styles.timer_time_count}>{hour}</span>:
                <span className={Styles.timer_time_count}>{minute}</span>:
                <span className={Styles.timer_time_count}>{second}</span>
            </div>
            <div className={Styles.timer_control_panel}>
                <button
                    type='button'
                    className={Styles.timer_control_btn}
                    disabled={detailLoading.playPause}
                    onClick={() => {
                        controlTimer(_id, isActive ? 'pause' : 'play').then(
                            (data) => {
                                if (data) data && setActive(!isActive);
                            },
                        );
                    }}
                >
                    {detailLoading.playPause || detailLoading.reset ? (
                        curcleSpin(21, 'white')
                    ) : (
                        <Image
                            width={isActive ? 16 : 26}
                            height={26}
                            src={isActive ? pauseIcon : playIcon}
                            alt='play'
                        />
                    )}
                </button>
                <button
                    type='button'
                    className={Styles.timer_control_btn}
                    disabled={detailLoading.reset}
                    onClick={() => {
                        controlTimer(_id, 'reset').then((data) => {
                            if (data) {
                                setActive(false);
                                setTime(total);
                            }
                        });
                    }}
                >
                    {detailLoading.reset ? (
                        curcleSpin(21, 'white')
                    ) : (
                        <Image
                            width={30}
                            height={30}
                            src={stopIcon}
                            alt='stop'
                        />
                    )}
                </button>
                <button type='button' className={Styles.timer_control_btn}>
                    <Image width={16} height={16} src={editIcon} alt='edit' />
                </button>
            </div>
            {extraChildren}
        </div>
    );
};

export default Timer;
