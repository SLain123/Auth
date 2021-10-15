import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import useHttp from '../../hooks/useHttp';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import BeatLoader from 'react-spinners/BeatLoader';
import { useCookies } from 'react-cookie';

import Styles from './Login.module.scss';

const Login = () => {
    const { loading, request } = useHttp();
    const [serverErrrors, setServerErrors] = useState<
        [] | { msg: string; value: string }[]
    >([]);
    const [resultMessage, setResultMessage] = useState('');
    const spinner = <BeatLoader color='white' loading size={10} />;
    const [cookies, setCookie] = useCookies(['user-data']);

    const sendLoginData = async (values: {
        email: string;
        password: string;
    }) => {
        const { email, password } = values;
        try {
            request('http://localhost:5000/api/auth/login', 'POST', {
                email,
                password,
            }).then((data) => {
                data.errors
                    ? setServerErrors(data.errors)
                    : setServerErrors([]);
                setResultMessage(data.message);
                if (data.token) {
                    const { token, userId } = data;
                    setCookie('user-data', { token, userId });
                }
            });
        } catch (e) {
            //@ts-ignore
            setServerErrors([e.message]);
        }
    };

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
                .min(8, 'Must be 8 characters or more')
                .max(20, 'Must be 20 characters or less')
                .required('Required'),
        }),
        onSubmit: (values) => {
            sendLoginData(values);
        },
    });

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
            <p className={Styles.status_text}>{resultMessage}</p>
            <Button
                className={Styles.login_btn}
                variant='contained'
                color='success'
                size='large'
                type='submit'
                disabled={
                    !formik.touched.email ||
                    Boolean(formik.errors.email) ||
                    !formik.touched.password ||
                    Boolean(formik.errors.password) ||
                    loading
                }
            >
                {loading ? spinner : 'Login'}
            </Button>
        </form>
    );
};

export default Login;
