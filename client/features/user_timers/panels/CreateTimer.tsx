import React, { FC } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { getAuthSelector } from '../../auth/authSlice';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCreateTimer } from '../../../service/timers/CreateTimerService';
import {
    convertToMilliSeconds,
    convertFromMilliSeconds,
} from '../../../utils/timeConverter';
import Link from 'next/link';
import { Spinner } from '../../../components/spinner';
import { TemplatesList } from '../../../components/templates_list';
import { useRefreshTimers } from '../../../hooks';

import Styles from '../Timers.module.scss';

const CreateTimer: FC = () => {
    const authStatus = useAppSelector(getAuthSelector);
    const { isLoading, isUserAuth } = authStatus;
    const { refreshTimers } = useRefreshTimers();

    const { createTimer, loading, serverErrors, resultMessage } =
        useCreateTimer();

    const { WhiteSpin, GreenSpin } = Spinner();

    const onChangeTemplateSelect = (total: number) => {
        const { hour, minute, second } = convertFromMilliSeconds(total);
        formik.setValues({
            label: `Template ${Boolean(hour) ? `${hour} hour(s)` : ''}${
                Boolean(minute) ? `${minute} minute(s)` : ''
            }`,
            hour,
            minute,
            second,
        });
    };

    const formik = useFormik({
        initialValues: {
            label: '',
            hour: 0,
            minute: 0,
            second: 0,
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
            total &&
                createTimer(label, total).then((message) => {
                    message && refreshTimers();
                });
            formik.setValues({
                label: '',
                hour: 0,
                minute: 0,
                second: 0,
            });
            formik.setTouched({
                label: false,
                hour: false,
                minute: false,
                second: false,
            });
        },
    });

    if (isLoading) {
        return (
            <div className={`${Styles.form} ${Styles.form_not_auth}`}>
                {GreenSpin}
            </div>
        );
    }

    if (!isUserAuth) {
        return (
            <div className={`${Styles.form} ${Styles.form_not_auth}`}>
                <span className={Styles.info_message}>
                    If you want to create a new personal timer, you need to
                    register or log in.
                </span>
                <Link href='/login'>
                    <a className={Styles.login_btn}>Log in</a>
                </Link>
            </div>
        );
    }

    return (
        <form
            className={`${Styles.form} ${Styles.form_success_left}`}
            onSubmit={formik.handleSubmit}
        >
            <h3 className={Styles.title}>Create new timer:</h3>
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
                disabled={loading}
                value={formik.values.label}
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
                    disabled={loading}
                    value={formik.values.hour}
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
                    disabled={loading}
                    value={formik.values.minute}
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
                    disabled={loading}
                    value={formik.values.second}
                />
            </div>

            <TemplatesList
                onChangeSelect={(total) => onChangeTemplateSelect(total)}
            />

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

            {serverErrors && (
                <ul className={Styles.error_list}>
                    {serverErrors.map((err) => (
                        <li key={err.msg} className={Styles.error_message}>
                            {err.msg}
                        </li>
                    ))}
                </ul>
            )}

            <p className={Styles.status_text}>{resultMessage}</p>

            <Button
                className={Styles.create_btn}
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
                    loading ||
                    Boolean(serverErrors.length > 0)
                }
            >
                {loading ? WhiteSpin : 'Create timer'}
            </Button>
        </form>
    );
};

export default CreateTimer;
