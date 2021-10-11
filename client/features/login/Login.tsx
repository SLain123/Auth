import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import useHttp from '../../hooks/useHttp';

import Styles from './Login.module.scss';

const Login = () => {
    const { loading, error, request } = useHttp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const sendLoginData = async (
        evt: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        evt.preventDefault();
        try {
            const data = await request(
                'http://localhost:5000/api/auth/login',
                'POST',
                { email, password },
            ).then((d) => console.log(d));
        } catch (e) {}
    };

    return (
        <form className={Styles.container}>
            <h3 className={Styles.title}>Login</h3>
            <TextField
                id='outlined-basic'
                label='E-mail'
                variant='outlined'
                fullWidth
                margin='dense'
                onBlur={(evt) => setEmail(evt.target.value)}
            />
            <TextField
                id='outlined-basic'
                label='Password'
                variant='outlined'
                fullWidth
                margin='dense'
                onBlur={(evt) => setPassword(evt.target.value)}
            />
            <Button
                className={Styles.login_btn}
                variant='contained'
                color='success'
                size='large'
                type='submit'
                onClick={sendLoginData}
                disabled={email === '' || password === '' || loading}
            >
                Login
            </Button>
        </form>
    );
};

export default Login;
