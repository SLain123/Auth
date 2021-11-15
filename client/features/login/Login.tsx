import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import useLoginService from '../../service/LoginService';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import BeatLoader from 'react-spinners/BeatLoader';
import DotLoader from 'react-spinners/DotLoader';
import { useAppSelector } from '../../hooks/useAppSelector';
import { getAuthSelector } from '../auth/authSlice';
import { useCookies } from 'react-cookie';
import useCheckTokenService from '../../service/TokenCheckService';

import Styles from './Login.module.scss';

const Login = () => {
    const loginService = useLoginService();
    const { sendLoginData, loading, serverErrrors, resultMessage } =
        loginService;
    const [cookies] = useCookies(['authData']);

    const authStatus = useAppSelector(getAuthSelector);
    const { isLoading, isUserAuth } = authStatus;
    const checkTokenService = useCheckTokenService(
        cookies.authData ? cookies.authData.token : null,
    );

    const spinnerWhite = <BeatLoader color='white' loading size={10} />;
    const spinnerGreen = (
        <DotLoader color='green' loading size={50} speedMultiplier={3} />
    );

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Required'),
            password: Yup.string()
                .min(6, 'Must be 6 characters or more')
                .max(20, 'Must be 20 characters or less')
                .required('Required'),
        }),
        onSubmit: (values) => {
            sendLoginData(values);
        },
    });

    useEffect(() => {
        if (isUserAuth) {
            location.href = '/';
        }
    }, [isUserAuth]);

    useEffect(() => {
        if (cookies.authData) {
            const { checkToken } = checkTokenService;
            checkToken();
        }
    }, [cookies]);

    if (isLoading) {
        return <div className={Styles.container}>{spinnerGreen}</div>;
    }

    return (
        <form className={Styles.container} onSubmit={formik.handleSubmit}>
            <h3 className={Styles.title}>Login</h3>
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
            <Link href='/reg'>
                <a className={Styles.link_reg}>Register now</a>
            </Link>
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
                    loading
                }
            >
                {loading ? spinnerWhite : 'Login'}
            </Button>
        </form>
    );
};

export default Login;
