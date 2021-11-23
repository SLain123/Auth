import React from 'react';
import { convertFromMilliSeconds } from '../../utils/timeConverter';
import Image from 'next/image';

import Styles from './Timer.module.scss';
import playIcon from '../../public/icons/play.svg';
import pauseIcon from '../../public/icons/pause.svg';
import stopIcon from '../../public/icons/stop.svg';
import editIcon from '../../public/icons/edit.svg';
import { TimerI } from '../../types/timer';

export interface TimerPropsI extends TimerI {
    formTitle?: string;
    extraChildren?: string | React.ReactElement | React.ReactNode;
}

const Timer: React.FC<TimerPropsI> = ({
    label,
    total,
    startTime,
    ownerNick,
    endTime,
    formTitle,
    extraChildren,
}) => {
    const { hour, minute, second } = convertFromMilliSeconds(total);

    return (
        <div className={Styles.timer_container}>
            <h3 className={Styles.timer_title}>{formTitle}</h3>
            <p className={Styles.timer_label}>{label}</p>
            <div className={Styles.timer_time_container}>
                <span className={Styles.timer_time_count}>{hour}</span>:
                <span className={Styles.timer_time_count}>{minute}</span>:
                <span className={Styles.timer_time_count}>{second}</span>
            </div>
            <div className={Styles.timer_control_panel}>
                <button type='button' className={Styles.timer_control_btn}>
                    <Image width={36} src={playIcon} alt='play' />
                </button>
                <button type='button' className={Styles.timer_control_btn}>
                    <Image width={22} src={pauseIcon} alt='pause' />
                </button>
                <button type='button' className={Styles.timer_control_btn}>
                    <Image width={40} src={stopIcon} alt='stop' />
                </button>
                <button type='button' className={Styles.timer_control_btn}>
                    <Image width={22} src={editIcon} alt='edit' />
                </button>
            </div>
            {extraChildren}
        </div>
    );
};

export default Timer;
