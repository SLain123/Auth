import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import useHttp from '../../hooks/useHttp';

import Styles from './Register.module.scss';

const Register = () => {
    const { loading, error, request } = useHttp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatePassword, setRepeatePassword] = useState('');

    const sendRgisterData = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        try {
            const data = await request(
                'http://localhost:5000/api/auth/register',
                'POST',
                { email, password },
            ).then((d) => console.log(d));
        } catch (e) {}
    };

    return (
        <form className={Styles.container} onSubmit={sendRgisterData}>
            <h3 className={Styles.title}>Registration</h3>
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
            <TextField
                id='outlined-basic'
                label='Repeat password'
                variant='outlined'
                fullWidth
                margin='dense'
                onBlur={(evt) => setRepeatePassword(evt.target.value)}
            />
            <Button
                className={Styles.login_btn}
                variant='contained'
                color='success'
                size='large'
                type='submit'
                disabled={
                    email === '' ||
                    password === '' ||
                    repeatePassword === '' ||
                    loading
                }
            >
                Send register data
            </Button>
        </form>
    );
};

export default Register;
