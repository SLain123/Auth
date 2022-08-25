import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Router from 'next/router';
import Link from 'next/link';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useRegisterService } from 'service/RegisterService';
import { getAuthSelector } from '../auth/authSlice';
import { Spinner } from 'components/spinner';
import { useWindowDimensions, useAppSelector } from 'hooks';
import { FormWrapper } from 'components/form_wrapper';

import Styles from './Register.module.scss';

const Register = () => {
    const { sendRegisterData, loading, serverErrors, resultMessage } =
        useRegisterService();
    const { width } = useWindowDimensions();
    const authStatus = useAppSelector(getAuthSelector);
    const { isLoading, isUserAuth } = authStatus;

    const { WhiteSpin, PurpleSpin } = Spinner();

    const inputSize = width && width >= 768 ? 'medium' : 'small';
    const btnSize = width && width >= 768 ? 'large' : 'medium';
    const errorList = serverErrors.map((err) => (
        <li key={err.msg} className={Styles.error_text}>
            {err.msg}
        </li>
    ));

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
        return <div className={Styles.container}>{PurpleSpin}</div>;
    }

    return (
        <div className={Styles.container}>
            <FormWrapper title='Registration'>
                <form onSubmit={formik.handleSubmit} className={Styles.content}>
                    <ul className={Styles.error_list}>{errorList}</ul>
                    <TextField
                        name='email'
                        id='email'
                        label='Email'
                        variant='outlined'
                        fullWidth
                        margin='dense'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.email && Boolean(formik.errors.email)
                        }
                        helperText={formik.touched.email && formik.errors.email}
                        disabled={loading}
                        size={inputSize}
                        className={Styles.input_title}
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
                            formik.touched.password &&
                            Boolean(formik.errors.password)
                        }
                        helperText={
                            formik.touched.password && formik.errors.password
                        }
                        disabled={loading}
                        size={inputSize}
                        className={Styles.input_title}
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
                        size={inputSize}
                        className={Styles.input_title}
                    />
                    <TextField
                        name='nickName'
                        id='nickName'
                        label='Nick name'
                        variant='outlined'
                        fullWidth
                        margin='dense'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.nickName &&
                            Boolean(formik.errors.nickName)
                        }
                        helperText={
                            formik.touched.nickName && formik.errors.nickName
                        }
                        disabled={loading}
                        size={inputSize}
                        className={Styles.input_title}
                    />
                    <Link href='/login'>
                        <a className={Styles.link_reg}>Login</a>
                    </Link>
                    <p className={Styles.status_text}>{resultMessage}</p>
                    <Button
                        className={Styles.login_btn}
                        variant='contained'
                        type='submit'
                        disabled={
                            Boolean(formik.errors.email) ||
                            Boolean(formik.errors.password) ||
                            Boolean(formik.errors.repeatPassword) ||
                            Boolean(formik.errors.nickName) ||
                            loading
                        }
                        size={btnSize}
                    >
                        {loading ? WhiteSpin : 'Register'}
                    </Button>
                </form>
            </FormWrapper>
        </div>
    );
};

export { Register };
