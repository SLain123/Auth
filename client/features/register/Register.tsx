import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import BeatLoader from 'react-spinners/BeatLoader';
import DotLoader from 'react-spinners/DotLoader';
import { useCookies } from 'react-cookie';
import Router from 'next/router';
import useRegisterService from '../../service/RegisterService';

import Styles from './Register.module.scss';

const Register = () => {
    const [cookies] = useCookies(['authData']);
    const [loaded, setLoaded] = useState(false);
    const registerService = useRegisterService();
    const { sendRegisterData, loading, serverErrrors, resultMessage } =
        registerService;

    const spinnerWhite = <BeatLoader color='white' loading size={10} />;
    const spinnerGreen = (
        <DotLoader color='green' loading size={50} speedMultiplier={3} />
    );

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            repeatPassword: '',
            firstName: '',
            lastName: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Required'),
            password: Yup.string()
                .min(8, 'Must be 8 characters or more')
                .max(20, 'Must be 20 characters or less')
                .required('Required'),
            repeatPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Required'),
            firstName: Yup.string()
                .min(3, 'Must be 3 characters or more')
                .max(20, 'Must be 20 characters or less')
                .required('Required'),
            lastName: Yup.string()
                .min(3, 'Must be 3 characters or more')
                .max(20, 'Must be 20 characters or less')
                .required('Required'),
        }),
        onSubmit: (values) => {
            sendRegisterData(values);
        },
    });

    useEffect(() => {
        if (cookies.authData) {
            location.href = '/';
        } else {
            setLoaded(true);
        }
    }, [cookies]);

    useEffect(() => {
        if (resultMessage === 'User was create!') {
            Router.push('/login');
        }
    }, [resultMessage]);

    if (!loaded) {
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
                name='firstName'
                id='firstName'
                label='First name'
                variant='outlined'
                fullWidth
                margin='dense'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                    formik.touched.firstName && Boolean(formik.errors.firstName)
                }
                helperText={formik.touched.firstName && formik.errors.firstName}
                disabled={loading}
            />
            <TextField
                name='lastName'
                id='lastName'
                label='Last name'
                variant='outlined'
                fullWidth
                margin='dense'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                    formik.touched.lastName && Boolean(formik.errors.lastName)
                }
                helperText={formik.touched.lastName && formik.errors.lastName}
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
                    Boolean(formik.errors.firstName) ||
                    Boolean(formik.errors.lastName) ||
                    loading
                }
            >
                {loading ? spinnerWhite : 'Send register data'}
            </Button>
        </form>
    );
};

export default Register;
