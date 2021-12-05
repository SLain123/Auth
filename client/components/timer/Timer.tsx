import React, { useState, useEffect } from 'react';
import { convertFromMilliSeconds } from '../../utils/timeConverter';
import Image from 'next/image';
import {
    useControlTimer,
    useChangeTimer,
    useRemoveTimer,
} from '../../service/TimerService';
import { TimerI } from '../../types/timer';
import Spinner from '../spinner/Spinner';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { convertToMilliSeconds } from '../../utils/timeConverter';

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

    const removeTimerService = useRemoveTimer();
    const {
        removeTimer,
        loading: loadingRemove,
        serverErrors: serverErrorsRemove,
        resultMessage: resultMessageRemove,
    } = removeTimerService;

    const changeTimerService = useChangeTimer();
    const {
        loading: loadingChange,
        serverErrors: serverErrorsChange,
        resultMessage: resultMessageChange,
        changeTimer,
    } = changeTimerService;

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
            hour: Yup.number(),
        }),
        onSubmit: (values) => {
            const { label, hour, minute, second } = values;
            const total = convertToMilliSeconds(hour, minute, second);
            total && changeTimer(_id, label, total);

            setTimeout(() => {
                setEditing(false);
            }, 500);
        },
    });

    useEffect(() => {
        const timer = setInterval(() => isActive && setTime(time - 1000), 1000);

        return () => clearInterval(timer);
    }, [time, isActive]);

    useEffect(() => {
        setTime(
            restTime
                ? restTime
                : timeToEnd
                ? new Date(timeToEnd).getTime() - new Date().getTime()
                : total,
        );
        setActive(Boolean(timeToEnd));
    }, [total, restTime, timeToEnd]);

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
                        disabled={loadingChange || loadingRemove}
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
                            disabled={loadingChange || loadingRemove}
                            defaultValue={hour}
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
                            disabled={loadingChange || loadingRemove}
                            defaultValue={minute}
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
                            disabled={loadingChange || loadingRemove}
                            defaultValue={second}
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
                        formik.values.minute > 59 ||
                        formik.values.second > 59) && (
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

                    {serverErrorsRemove && (
                        <ul className={Styles.error_list}>
                            {serverErrorsRemove.map((err) => (
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
                    {resultMessageRemove && (
                        <p className={Styles.status_text}>
                            {resultMessageRemove}
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
                            formik.values.minute > 59 ||
                            formik.values.second > 59 ||
                            (!+formik.values.hour &&
                                !+formik.values.minute &&
                                !+formik.values.second) ||
                            loadingChange ||
                            loadingRemove ||
                            Boolean(serverErrorsChange.length > 0) ||
                            Boolean(serverErrorsRemove.length > 0)
                        }
                    >
                        {loadingChange || loadingRemove
                            ? WhiteSpin
                            : 'Change Timer'}
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
                        <span className={Styles.timer_time_count}>{hour}</span>:
                        <span className={Styles.timer_time_count}>
                            {minute}
                        </span>
                        :
                        <span className={Styles.timer_time_count}>
                            {second}
                        </span>
                    </div>
                    <div className={Styles.timer_control_panel}>
                        <button
                            type='button'
                            className={Styles.timer_control_btn}
                            disabled={detailLoading.playPause}
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
                        <button
                            type='button'
                            className={Styles.timer_control_btn}
                            onClick={() => {
                                setEditing(true);
                                isActive && controlTimer(_id, 'pause');
                            }}
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
