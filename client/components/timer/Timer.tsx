import React, { useState, useEffect } from 'react';
import { convertFromMilliSeconds } from '../../utils/timeConverter';
import Image from 'next/image';
import { useControlTimer, useChangeTimer } from '../../service/TimerService';
import { TimerI } from '../../types/timer';
import Spinner from '../spinner/Spinner';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    convertToMilliSeconds,
    addTimeFormat,
} from '../../utils/timeConverter';
import { useCookies } from 'react-cookie';

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
    ownerId,
}) => {
    const [isActive, setActive] = useState(Boolean(timeToEnd));
    const [isEditing, setEditing] = useState(false);
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

    const changeTimerService = useChangeTimer();
    const {
        loading: loadingChange,
        serverErrors: serverErrorsChange,
        resultMessage: resultMessageChange,
        changeTimer,
    } = changeTimerService;

    const [cookies] = useCookies(['authData']);
    const isOwner = () => cookies.authData.userId === ownerId;

    const { curcleSpin, WhiteSpin } = Spinner();

    const formik = useFormik({
        initialValues: {
            label,
            hour,
            minute,
            second,
        },
        validationSchema: Yup.object({
            label: Yup.string()
                .max(40, 'Must be 40 characters or less')
                .required('Required'),
            hour: Yup.number().typeError(''),
            minute: Yup.number().typeError(''),
            second: Yup.number().typeError(''),
        }),
        onSubmit: (values) => {
            const { label, hour, minute, second } = values;
            const total = convertToMilliSeconds(hour, minute, second);
            total && changeTimer(_id, label, total);

            setTimeout(() => {
                setEditing(false);
            }, 1000);
        },
    });

    // Запускает счет таймера если есть время и статус активен, в случае достижения нулевого значения отправляет reset на сервер и отключает активный статус, загружает исходное время таймера в стейт;
    useEffect(() => {
        const timer = setInterval(() => {
            if (isActive && time > 1000 && !isEditing) {
                setTime(time - 1000);
            }

            if (time <= 1000 && isActive) {
                controlTimer(_id, 'reset').then((data) => {
                    if (data) {
                        setActive(false);
                        setTime(total);
                    }
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [time, isActive]);

    // Опеределяет начальное состояние таймера, активен/не активен, на основе полученных данных из props;
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
            controlTimer(_id, 'reset').then((data) => {
                if (data) {
                    setActive(false);
                    setTime(total);
                }
            });
    }, [total, restTime, timeToEnd]);

    // В режиме редактирования записывает текущие значения имени и времени таймера в формик для прохождения валидации;
    useEffect(() => {
        if (isEditing) {
            formik.setValues({ label, hour, minute, second });
            setActive(false);
        }
    }, [label, hour, minute, second, isEditing]);

    return (
        <div className={Styles.container}>
            {isEditing ? (
                <form
                    onSubmit={formik.handleSubmit}
                    className={Styles.edit_form}
                >
                    <h3 className={Styles.title}>Change timer:</h3>
                    <TextField
                        name='label'
                        id='label'
                        label='Timer name'
                        variant='outlined'
                        fullWidth
                        margin='dense'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.label && Boolean(formik.errors.label)
                        }
                        helperText={formik.touched.label && formik.errors.label}
                        disabled={loadingChange}
                        defaultValue={label}
                    />
                    <h4 className={Styles.subtitle}>
                        Specify the required time before completion:
                    </h4>
                    <div className={Styles.time_container}>
                        <TextField
                            className={Styles.time_input}
                            name='hour'
                            id='hour'
                            label='Hours'
                            variant='outlined'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.hour &&
                                Boolean(formik.errors.hour)
                            }
                            disabled={loadingChange}
                            defaultValue={addTimeFormat(hour)}
                        />
                        {formik.touched.hour && formik.errors.hour ? (
                            <div>{formik.errors.hour}</div>
                        ) : null}
                        <span className={Styles.time_dotted}>:</span>
                        <TextField
                            className={Styles.time_input}
                            name='minute'
                            id='minute'
                            label='Minutes'
                            variant='outlined'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.minute &&
                                Boolean(formik.errors.minute)
                            }
                            helperText={
                                formik.touched.minute && formik.errors.minute
                            }
                            disabled={loadingChange}
                            defaultValue={addTimeFormat(minute)}
                        />
                        <span className={Styles.time_dotted}>:</span>
                        <TextField
                            className={Styles.time_input}
                            name='second'
                            id='second'
                            label='Seconds'
                            variant='outlined'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.second &&
                                Boolean(formik.errors.second)
                            }
                            helperText={
                                formik.touched.second && formik.errors.second
                            }
                            disabled={loadingChange}
                            defaultValue={addTimeFormat(second)}
                        />
                    </div>

                    {!formik.values.hour &&
                        !formik.values.minute &&
                        !formik.values.second &&
                        (formik.touched.hour ||
                            formik.touched.minute ||
                            formik.touched.second) && (
                            <p className={Styles.error_message}>
                                You need to specify at least 1 second or more
                            </p>
                        )}
                    {(formik.values.hour > 99 ||
                        formik.values.hour < 0 ||
                        formik.values.minute > 59 ||
                        formik.values.minute < 0 ||
                        formik.values.second > 59 ||
                        formik.values.second < 0) && (
                        <p className={Styles.error_message}>
                            {`You can't type more than 59 secs, 59 mins or 99
                            hours`}
                        </p>
                    )}

                    {serverErrorsChange && (
                        <ul className={Styles.error_list}>
                            {serverErrorsChange.map((err) => (
                                <li
                                    key={err.msg}
                                    className={Styles.error_message}
                                >
                                    {err.msg}
                                </li>
                            ))}
                        </ul>
                    )}

                    {resultMessageChange && (
                        <p className={Styles.status_text}>
                            {resultMessageChange}
                        </p>
                    )}

                    <Button
                        className={Styles.change_btn}
                        variant='contained'
                        color='success'
                        size='large'
                        type='submit'
                        disabled={
                            Boolean(formik.errors.label) ||
                            Boolean(formik.errors.hour) ||
                            Boolean(formik.errors.minute) ||
                            Boolean(formik.errors.second) ||
                            formik.values.hour > 99 ||
                            formik.values.hour < 0 ||
                            formik.values.minute > 59 ||
                            formik.values.minute < 0 ||
                            formik.values.second > 59 ||
                            formik.values.second < 0 ||
                            (!+formik.values.hour &&
                                !+formik.values.minute &&
                                !+formik.values.second) ||
                            loadingChange ||
                            Boolean(serverErrorsChange.length > 0)
                        }
                    >
                        {loadingChange ? WhiteSpin : 'Change Timer'}
                    </Button>
                    <Button
                        className={Styles.back_btn}
                        variant='contained'
                        color='info'
                        size='small'
                        type='button'
                        onClick={() => setEditing(false)}
                    >
                        Back
                    </Button>
                </form>
            ) : (
                <div>
                    {formTitle && (
                        <h3 className={Styles.timer_title}>{formTitle}</h3>
                    )}
                    <p className={Styles.timer_label}>{label}</p>
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
                    <div className={Styles.timer_control_panel}>
                        <button
                            type='button'
                            className={Styles.timer_control_btn}
                            disabled={detailLoading.playPause || !isOwner()}
                            onClick={() => {
                                controlTimer(
                                    _id,
                                    isActive ? 'pause' : 'play',
                                ).then((data) => {
                                    if (data) data && setActive(!isActive);
                                });
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
                            disabled={detailLoading.reset || !isOwner()}
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
                        <button
                            type='button'
                            className={Styles.timer_control_btn}
                            onClick={() => {
                                setEditing(true);
                                isActive && controlTimer(_id, 'pause');
                            }}
                            disabled={!isOwner()}
                        >
                            <Image
                                width={16}
                                height={16}
                                src={editIcon}
                                alt='edit'
                            />
                        </button>
                    </div>
                    {extraChildren}
                </div>
            )}
        </div>
    );
};

export default Timer;
