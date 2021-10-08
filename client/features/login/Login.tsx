import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import Styles from './Login.module.scss';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className={Styles.container}>
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
                onClick={() => console.log(email, password)}
                disabled={email === '' || password === ''}
            >
                Login
            </Button>
        </div>
    );
};

export default Login;
