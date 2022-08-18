import React, { useState, useEffect, useCallback, FC } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useProfileService } from 'service/ProfileService';
import { getAuthSelector } from 'features/auth/authSlice';
import { Spinner } from 'components/spinner';
import { useWindowDimensions, useAppSelector } from 'hooks';
import { UserAvatar } from './UserAvatar';

import Styles from './Profile.module.scss';

const Profile: FC = () => {
    const { width } = useWindowDimensions();
    const authStatus = useAppSelector(getAuthSelector);
    const { isLoading, isUserAuth } = authStatus;

    const [userAvatar, setUserAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [userDataLoading, setUserDataLoading] = useState(true);

    const {
        getUserData,
        sendUserData,
        sendUserAvatar,
        serverErrors,
        setServerErrors,
        loading,
        resultMessage,
    } = useProfileService();

    const { WhiteSpin, GreenSpin } = Spinner();

    const inputSize = width && width >= 768 ? 'medium' : 'small';
    const btnSize = width && width >= 768 ? 'large' : 'medium';
    const errorList = serverErrors.map((err) => (
        <li key={err.msg} className={Styles.error_text}>
            {err.msg}
        </li>
    ));

    const formik = useFormik({
        initialValues: {
            nickName: '',
        },
        validationSchema: Yup.object({
            nickName: Yup.string()
                .min(3, 'Must be 3 characters or more')
                .max(40, 'Must be 40 characters or less')
                .required('Required'),
        }),
        onSubmit: (values) => {
            sendUserData(values.nickName);
            userAvatar && sendUserAvatar(userAvatar);
        },
    });

    const saveAvatarPrewiev = useCallback((avatar: string | null) => {
        setAvatarPreview(avatar);
    }, []);

    const saveAvatar = useCallback((avatar: File) => {
        setUserAvatar(avatar);
    }, []);

    useEffect(() => {
        if (!isUserAuth && !isLoading) {
            location.href = '/login';
        }
    }, [isUserAuth, isLoading]);

    useEffect(() => {
        getUserData()
            .then(({ nickName, avatar, errors }) => {
                setUserDataLoading(false);
                if (errors) {
                    setServerErrors(errors);
                } else {
                    setServerErrors([]);
                    saveAvatarPrewiev(avatar);
                    formik.setValues({ nickName });
                }
            })
            .catch(() => setUserDataLoading(false));
    }, []);

    if (isLoading || userDataLoading) {
        return <div className={Styles.container}>{GreenSpin}</div>;
    }

    return (
        <div className={Styles.container}>
            <UserAvatar
                avatarPreview={avatarPreview}
                saveAvatar={saveAvatar}
                saveAvatarPrewiev={saveAvatarPrewiev}
                nickName={formik.values.nickName}
            />

            <form className={Styles.form} onSubmit={formik.handleSubmit}>
                <ul className={Styles.error_list}>{errorList}</ul>
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
                    value={formik.values.nickName}
                    size={inputSize}
                />
                <p className={Styles.status_text}>{resultMessage}</p>
                <Button
                    className={Styles.btn}
                    variant='contained'
                    color='success'
                    size={btnSize}
                    type='submit'
                    disabled={Boolean(formik.errors.nickName) || loading}
                >
                    {loading ? WhiteSpin : 'Change profile'}
                </Button>
            </form>
        </div>
    );
};

export { Profile };
