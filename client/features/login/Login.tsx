import React, { useEffect } from 'react';
import Link from 'next/link';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useCookies } from 'react-cookie';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useLoginService } from 'service/LoginService';
import { Spinner } from 'components/spinner';
import { getAuthSelector } from '../auth/authSlice';
import { useWindowDimensions, useAppSelector, useTokenCheck } from 'hooks';
import { FormWrapper } from 'components/form_wrapper';

import Styles from './Login.module.scss';

const Login = () => {
    const [cookies] = useCookies(['authData']);
    const { width } = useWindowDimensions();
    const checkTokenService = useTokenCheck();

    const { sendLoginData, loading, serverErrors, resultMessage } =
        useLoginService();

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
        if (cookies.authData?.token) {
            const { checkToken } = checkTokenService;
            checkToken(cookies.authData.token);
        }
    }, [cookies.authData]);

    if (isLoading) {
        return <div className={Styles.container}>{PurpleSpin}</div>;
    }

    return (
        <div className={Styles.container}>
            <FormWrapper title='Login'>
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
                    <Link href='/reg'>
                        <a className={Styles.link_reg}>Registration</a>
                    </Link>
                    <p className={Styles.status_text}>{resultMessage}</p>
                    <Button
                        className={Styles.login_btn}
                        variant='contained'
                        type='submit'
                        disabled={
                            Boolean(formik.errors.email) ||
                            Boolean(formik.errors.password) ||
                            loading
                        }
                        size={btnSize}
                    >
                        {loading ? WhiteSpin : 'Login'}
                    </Button>
                </form>
            </FormWrapper>
        </div>
    );
};

export { Login };
