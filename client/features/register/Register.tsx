import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import BeatLoader from 'react-spinners/BeatLoader';
import DotLoader from 'react-spinners/DotLoader';
import Router from 'next/router';
import useRegisterService from '../../service/RegisterService';
import { useAppSelector } from '../../hooks/useAppSelector';
import { getAuthSelector } from '../auth/authSlice';

import Styles from './Register.module.scss';

const Register = () => {
    const registerService = useRegisterService();
    const { sendRegisterData, loading, serverErrrors, resultMessage } =
        registerService;

    const spinnerWhite = <BeatLoader color='white' loading size={10} />;
    const spinnerGreen = (
        <DotLoader color='green' loading size={50} speedMultiplier={3} />
    );

    const authStatus = useAppSelector(getAuthSelector);
    const { isLoading, isUserAuth } = authStatus;

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            repeatPassword: '',
            nickName: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Required'),
            password: Yup.string()
                .min(6, 'Must be 6 characters or more')
                .max(20, 'Must be 20 characters or less')
                .required('Required'),
            repeatPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Required'),
            nickName: Yup.string()
                .min(3, 'Must be 3 characters or more')
                .max(40, 'Must be 40 characters or less')
                .required('Required'),
        }),
        onSubmit: (values) => {
            sendRegisterData(values);
        },
    });

    useEffect(() => {
        if (isUserAuth) {
            location.href = '/';
        }
    }, [isUserAuth]);

    useEffect(() => {
        if (resultMessage === 'User was create!') {
            Router.push('/login');
        }
    }, [resultMessage]);

    if (isLoading) {
        return <div className={Styles.container}>{spinnerGreen}</div>;
    }

    return (
        <form className={Styles.container} onSubmit={formik.handleSubmit}>
            <h3 className={Styles.title}>Registration</h3>
            <ul className={Styles.error_list}>
                {serverErrrors.map((err) => (
                    <li key={err.msg} className={Styles.error_text}>
                        {err.msg}
                    </li>
                ))}
            </ul>
            <TextField
                name='email'
                id='email'
                label='Email'
                variant='outlined'
                fullWidth
                margin='dense'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                disabled={loading}
            />
            <TextField
                name='password'
                id='password'
                label='Password'
                variant='outlined'
                fullWidth
                type='password'
                margin='dense'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                    formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                disabled={loading}
            />
            <TextField
                name='repeatPassword'
                id='outlined-basic'
                label='Repeat password'
                variant='outlined'
                fullWidth
                type='password'
                margin='dense'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                    formik.touched.repeatPassword &&
                    Boolean(formik.errors.repeatPassword)
                }
                helperText={
                    formik.touched.repeatPassword &&
                    formik.errors.repeatPassword
                }
                disabled={loading}
            />
            <TextField
                name='nickName'
                id='nickName'
                label='nick name'
                variant='outlined'
                fullWidth
                margin='dense'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                    formik.touched.nickName && Boolean(formik.errors.nickName)
                }
                helperText={formik.touched.nickName && formik.errors.nickName}
                disabled={loading}
            />
            <p className={Styles.status_text}>{resultMessage}</p>
            <Button
                className={Styles.login_btn}
                variant='contained'
                color='success'
                size='large'
                type='submit'
                disabled={
                    Boolean(formik.errors.email) ||
                    Boolean(formik.errors.password) ||
                    Boolean(formik.errors.repeatPassword) ||
                    Boolean(formik.errors.nickName) ||
                    loading
                }
            >
                {loading ? spinnerWhite : 'Send register data'}
            </Button>
        </form>
    );
};

export default Register;
