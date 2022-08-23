import React, { FC } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { useAppSelector, useRefreshTimers } from 'hooks';
import { getAuthSelector } from 'features/auth/authSlice';
import { useCreateTimer } from 'service/timers/CreateTimerService';
import {
    convertToMilliSeconds,
    convertFromMilliSeconds,
} from 'utils/timeConverter';
import { Spinner } from 'components/spinner';
import { TemplatesList } from 'components/templates_list';
import { NoAuthWarning } from './NoAuthWarning';

import Styles from '../Timers.module.scss';

const CreateTimer: FC = () => {
    const authStatus = useAppSelector(getAuthSelector);
    const { isLoading, isUserAuth } = authStatus;

    const { refreshTimers } = useRefreshTimers();
    const { createTimer, loading, serverErrors, resultMessage } =
        useCreateTimer();

    const { WhiteSpin, GreenSpin } = Spinner();

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

    const errorList = (
        <ul className={Styles.error_list}>
            {serverErrors.map((err) => (
                <li key={err.msg} className={Styles.error_message}>
                    {err.msg}
                </li>
            ))}
        </ul>
    );

    const isLessThenOneSecond = Boolean(
        !formik.values.hour &&
            !formik.values.minute &&
            !formik.values.second &&
            (formik.touched.hour ||
                formik.touched.minute ||
                formik.touched.second),
    );

    const isWrongTimeFormat = Boolean(
        formik.values.hour > 99 ||
            formik.values.hour < 0 ||
            formik.values.minute > 59 ||
            formik.values.minute < 0 ||
            formik.values.second > 59 ||
            formik.values.second < 0,
    );

    const isDisabledCreateBtn = Boolean(
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
            Boolean(serverErrors.length > 0),
    );

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

    if (isLoading) {
        return (
            <div className={`${Styles.main} ${Styles.form_not_auth}`}>
                {GreenSpin}
            </div>
        );
    }

    if (!isUserAuth) {
        return <NoAuthWarning />;
    }

    return (
        <div className={`${Styles.container} ${Styles.container_success_left}`}>
            <h3 className={Styles.title}>Create new timer:</h3>
            <div className={Styles.form_wrapper}>
                <form
                    onSubmit={formik.handleSubmit}
                    className={Styles.form_content}
                >
                    <TextField
                        name='label'
                        id='label'
                        label='Timer name'
                        variant='outlined'
                        fullWidth
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.label && Boolean(formik.errors.label)
                        }
                        helperText={formik.touched.label && formik.errors.label}
                        disabled={loading}
                        value={formik.values.label}
                        className={Styles.input_title}
                        size='small'
                    />
                    <h4 className={Styles.subtitle}>
                        Specify the required time before completion:
                    </h4>
                    <div className={Styles.time_container}>
                        <TextField
                            className={Styles.input_num}
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
                            disabled={loading}
                            value={formik.values.hour}
                        />
                        {formik.touched.hour && formik.errors.hour ? (
                            <div>{formik.errors.hour}</div>
                        ) : null}
                        <span className={Styles.time_dotted}>:</span>
                        <TextField
                            className={Styles.input_num}
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
                            disabled={loading}
                            value={formik.values.minute}
                        />
                        <span className={Styles.time_dotted}>:</span>
                        <TextField
                            className={Styles.input_num}
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
                            disabled={loading}
                            value={formik.values.second}
                        />
                    </div>

                    <TemplatesList
                        onChangeTime={(total) => onChangeTemplateSelect(total)}
                    />

                    {isLessThenOneSecond && (
                        <p className={Styles.error_message}>
                            You need to specify at least 1 second or more
                        </p>
                    )}
                    {isWrongTimeFormat && (
                        <p className={Styles.error_message}>
                            You can't type more than 59 secs, 59 mins or 99
                            Hours
                        </p>
                    )}
                    {serverErrors && errorList}

                    <p className={Styles.status_text}>{resultMessage}</p>

                    <Button
                        className={Styles.create_btn}
                        variant='contained'
                        size='large'
                        type='submit'
                        disabled={isDisabledCreateBtn}
                    >
                        {loading ? WhiteSpin : 'Create timer'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export { CreateTimer };
