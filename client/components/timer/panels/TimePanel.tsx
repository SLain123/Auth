import React, { FC } from 'react';
import { convertFromMilliSeconds, addTimeFormat } from 'utils/timeConverter';

import Styles from '../Timer.module.scss';

export interface ITimePanel {
    time: number;
}

const TimePanel: FC<ITimePanel> = ({ time }) => {
    const { hour, minute, second } = convertFromMilliSeconds(time);

    return (
        <div className={Styles.timer_time_container}>
            <span className={Styles.timer_time_count}>
                {addTimeFormat(hour)}
            </span>
            :
            <span className={Styles.timer_time_count}>
                {addTimeFormat(minute)}
            </span>
            :
            <span className={Styles.timer_time_count}>
                {addTimeFormat(second)}
            </span>
        </div>
    );
};

export { TimePanel };
