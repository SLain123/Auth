import React, { useState, useEffect, FC, useCallback } from 'react';

import { useControlTimer } from 'service/timers/ControlTimerService';
import { getCurrentTimer } from 'features/current_timer/currentTimerSlice';
import { useAppSelector } from 'hooks';
import { EditPanel } from './panels/EditPanel';
import { TimePanel } from './panels/TimePanel';
import { PlayBtn } from './btns/PlayBtn';
import { StopBtn } from './btns/StopBtn';
import { EditBtn } from './btns/EditBtn';

import Styles from './Timer.module.scss';

export interface ITimerProps {
    extraChildren?: string | React.ReactElement | React.ReactNode;
}

const Timer: FC<ITimerProps> = ({ extraChildren }) => {
    const currentTimer = useAppSelector(getCurrentTimer);
    const { timer } = currentTimer;
    const { _id, label, timeToEnd, restTime, total } = timer;
    const [isActive, setActive] = useState(Boolean(timeToEnd));
    const [isEditing, setEditing] = useState(false);
    const [time = 0, setTime] = useState(
        restTime
            ? restTime
            : timeToEnd
            ? new Date(timeToEnd).getTime() - new Date().getTime()
            : total,
    );

    const { controlTimer } = useControlTimer();

    const changeEditStatus = useCallback((status: boolean) => {
        setEditing(status);
    }, []);

    const changeActiveStatus = useCallback((status: boolean) => {
        setActive(status);
    }, []);

    const changeTime = useCallback((time: number) => {
        setTime(time);
    }, []);

    // Запускает счет таймера если есть время и статус активен, в случае достижения нулевого значения отправляет reset на сервер и отключает активный статус, загружает исходное время таймера в стейт;
    useEffect(() => {
        const timer = setInterval(() => {
            if (isActive && time > 1000 && !isEditing) {
                setTime(time - 1000);
            }

            if (time <= 1000 && isActive) {
                controlTimer(_id, 'reset').then((result) => {
                    if (result.message) {
                        setActive(false);
                        setTime(total);
                    }
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [time, isActive]);

    // Определяет начальное состояние таймера, активен/не активен, на основе полученных данных из props;
    useEffect(() => {
        setTime(
            restTime
                ? restTime
                : timeToEnd
                ? new Date(timeToEnd).getTime() - new Date().getTime()
                : total,
        );
        setActive(Boolean(timeToEnd));

        // Запрос на reset данных таймера на сервере в случае просроченной даты окончания таймера, отключение активного статуса таймера и добавление общего времени таймера в стейт вместо оставшегося времени;
        timeToEnd &&
            new Date(timeToEnd).getTime() - new Date().getTime() <= 0 &&
            controlTimer(_id, 'reset').then((result) => {
                if (result.message) {
                    setActive(false);
                    setTime(total);
                }
            });
    }, [total, restTime, timeToEnd]);

    return (
        <div className={Styles.container}>
            {isEditing ? (
                <EditPanel
                    changeEditStatus={changeEditStatus}
                    _id={_id}
                    label={label}
                    time={time}
                />
            ) : (
                <div className={Styles.content}>
                    <TimePanel time={time} />

                    <div className={Styles.timer_control_panel}>
                        <PlayBtn
                            isActive={isActive}
                            changeActiveStatus={changeActiveStatus}
                        />
                        <StopBtn
                            changeTime={changeTime}
                            changeActiveStatus={changeActiveStatus}
                        />
                        <EditBtn
                            isActive={isActive}
                            changeEditStatus={changeEditStatus}
                        />
                    </div>
                    {extraChildren}
                </div>
            )}
        </div>
    );
};

export { Timer };
