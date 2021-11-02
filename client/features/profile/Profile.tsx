import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import useHttp from '../../hooks/useHttp';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Avatar from '@mui/material/Avatar';
import { useCookies } from 'react-cookie';
import Router from 'next/router';
import BeatLoader from 'react-spinners/BeatLoader';
import DotLoader from 'react-spinners/DotLoader';

import Styles from './Profile.module.scss';

function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name: string) {
    return {
        sx: {
            bgcolor: stringToColor(name),
            width: 64,
            height: 64,
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}

const Profile: React.FC = () => {
    const { loading, request } = useHttp();
    const [serverErrrors, setServerErrors] = useState<
        [] | { msg: string; value: string }[]
    >([]);
    const [resultMessage, setResultMessage] = useState('');
    const [cookies] = useCookies(['token']);
    const [loaded, setLoaded] = useState(false);

    const spinnerWhite = <BeatLoader color='white' loading size={10} />;
    const spinnerGreen = (
        <DotLoader color='green' loading size={50} speedMultiplier={3} />
    );

    const sendUserData = async (values: {
        firstName: string;
        lastName: string;
    }) => {
        const { firstName, lastName } = values; //TODO: сделать загрузку данных пользователя и отправку данных в другой функции;
        try {
            request('http://localhost:5000/api/auth/register', 'POST', {
                firstName,
                lastName,
            }).then((data) => {
                data.errors
                    ? setServerErrors(data.errors)
                    : setServerErrors([]);
                setResultMessage(data.message);
            });
        } catch (e) {
            //@ts-ignore
            setServerErrors([e.message]);
        }
    };

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
        },
        validationSchema: Yup.object({
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
            sendUserData(values);
        },
    });

    useEffect(() => {
        if (!cookies.token) {
            location.href = '/login';
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
        <div className={Styles.container}>
            <h3 className={Styles.title}>Change user profile:</h3>
            <Avatar {...stringAvatar('Kent Dodds')} className={Styles.avatar} />
            <input type='file' />

            <form className={Styles.form} onSubmit={formik.handleSubmit}>
                <ul className={Styles.error_list}>
                    {serverErrrors.map((err) => (
                        <li key={err.msg} className={Styles.error_text}>
                            {err.msg}
                        </li>
                    ))}
                </ul>
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
                        formik.touched.firstName &&
                        Boolean(formik.errors.firstName)
                    }
                    helperText={
                        formik.touched.firstName && formik.errors.firstName
                    }
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
                        formik.touched.lastName &&
                        Boolean(formik.errors.lastName)
                    }
                    helperText={
                        formik.touched.lastName && formik.errors.lastName
                    }
                    disabled={loading}
                />
                <p className={Styles.status_text}>{resultMessage}</p>
                <Button
                    className={Styles.btn}
                    variant='contained'
                    color='success'
                    size='large'
                    type='submit'
                    disabled={
                        Boolean(formik.errors.firstName) ||
                        Boolean(formik.errors.lastName) ||
                        loading
                    }
                >
                    {loading ? spinnerWhite : 'Send register data'}
                </Button>
            </form>
        </div>
    );
};

export default Profile;
