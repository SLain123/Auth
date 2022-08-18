import React, { FC, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { IServerErrors } from 'types/serviceType';
import { useAppDispatch, useRefreshTimers } from 'hooks';
import { useChangeTimer } from 'service/timers/EditTimerService';
import {
    convertToMilliSeconds,
    addTimeFormat,
    convertFromMilliSeconds,
} from 'utils/timeConverter';
import { saveSingleTimer } from 'features/current_timer/currentTimerSlice';
import { Spinner } from '../../spinner/Spinner';

import Styles from '../Timer.module.scss';

export interface IEditPanel {
    _id: string;
    label: string;
    time: number;
    changeEditStatus: (status: boolean) => void;
}

const EditPanel: FC<IEditPanel> = ({ _id, label, time, changeEditStatus }) => {
    const { hour, minute, second } = convertFromMilliSeconds(time);

    const [loadingChange, setLoadingChange] = useState(false);
    const [serverErrors, setServerErrors] = useState<IServerErrors[]>([]);
    const [resultMessage, setResultMessage] = useState('');

    const dispatch = useAppDispatch();

    const { refreshTimers } = useRefreshTimers();
    const { changeTimer } = useChangeTimer();

    const { WhiteSpin } = Spinner();

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
            if (total) {
                setLoadingChange(true);
                changeTimer(_id, label, total)
                    .then((result) => {
                        result?.errors && setServerErrors(result.errors);

                        if (result && result.message && result.timer) {
                            setResultMessage(result.message);
                            dispatch(saveSingleTimer(result.timer));
                            refreshTimers();

                            setTimeout(() => setResultMessage(''), 3000);
                        } else {
                            displayDefaultError();
                        }
                    })
                    .catch(() => displayDefaultError())
                    .finally(() => setLoadingChange(false));
            }

            setTimeout(() => {
                changeEditStatus(false);
            }, 1000);
        },
    });

    const isEmptyTime = Boolean(
        !formik.values.hour &&
            !formik.values.minute &&
            !formik.values.second &&
            (formik.touched.hour ||
                formik.touched.minute ||
                formik.touched.second),
    );

    const isWrongTime = Boolean(
        formik.values.hour > 99 ||
            formik.values.hour < 0 ||
            formik.values.minute > 59 ||
            formik.values.minute < 0 ||
            formik.values.second > 59 ||
            formik.values.second < 0,
    );

    const isDisabledSaveBtn = Boolean(
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
            Boolean(serverErrors.length > 0),
    );

    const displayDefaultError = () => {
        setServerErrors([
            {
                msg: 'Something was wrong',
                value: 'Something was wrong',
            },
        ]);
    };

    useEffect(() => {
        formik.setValues({ label, hour, minute, second });
    }, [label, hour, minute, second]);

    return (
        <form onSubmit={formik.handleSubmit} className={Styles.edit_form}>
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
                error={formik.touched.label && Boolean(formik.errors.label)}
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
                    error={formik.touched.hour && Boolean(formik.errors.hour)}
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
                        formik.touched.minute && Boolean(formik.errors.minute)
                    }
                    helperText={formik.touched.minute && formik.errors.minute}
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
                        formik.touched.second && Boolean(formik.errors.second)
                    }
                    helperText={formik.touched.second && formik.errors.second}
                    disabled={loadingChange}
                    defaultValue={addTimeFormat(second)}
                />
            </div>

            {isEmptyTime && (
                <p className={Styles.error_message}>
                    You need to specify at least 1 second or more
                </p>
            )}
            {isWrongTime && (
                <p className={Styles.error_message}>
                    {`You can't type more than 59 secs, 59 mins or 99
            hours`}
                </p>
            )}
            {serverErrors && (
                <ul className={Styles.error_list}>
                    {serverErrors.map((err) => (
                        <li key={err.msg} className={Styles.error_message}>
                            {err.msg}
                        </li>
                    ))}
                </ul>
            )}

            {resultMessage && (
                <p className={Styles.status_text}>{resultMessage}</p>
            )}

            <Button
                className={Styles.change_btn}
                variant='contained'
                color='success'
                size='large'
                type='submit'
                disabled={isDisabledSaveBtn}
            >
                {loadingChange ? WhiteSpin : 'Change Timer'}
            </Button>
            <Button
                className={Styles.back_btn}
                variant='contained'
                color='info'
                size='small'
                type='button'
                onClick={() => changeEditStatus(false)}
            >
                Back
            </Button>
        </form>
    );
};

export { EditPanel };
