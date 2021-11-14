import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Avatar from '@mui/material/Avatar';
import BeatLoader from 'react-spinners/BeatLoader';
import DotLoader from 'react-spinners/DotLoader';
import useProfileService from '../../service/ProfileService';
import stringAvatar from './subFuncs';
import { useAppSelector } from '../../hooks/useAppSelector';
import { getAuthSelector } from '../auth/authSlice';

import Styles from './Profile.module.scss';

const Profile: React.FC = () => {
    const avatarSize = 200;
    const [userData, setUserData] = useState({ firstName: '', lastName: '' });
    const { firstName, lastName } = userData;
    const [userAvatar, setUserAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState(false);
    const [userDataLoading, setUserDataLoading] = useState(true);

    const authStatus = useAppSelector(getAuthSelector);
    const { isLoading, isUserAuth } = authStatus;

    const profileService = useProfileService();
    const {
        getUserData,
        sendUserData,
        sendUserAvatar,
        serverErrrors,
        setServerErrors,
        loading,
        resultMessage,
    } = profileService;

    const spinnerWhite = <BeatLoader color='white' loading size={10} />;
    const spinnerGreen = (
        <DotLoader color='green' loading size={50} speedMultiplier={3} />
    );

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
            userAvatar && sendUserAvatar(userAvatar);
        },
    });

    useEffect(() => {
        if (!isUserAuth && !isLoading) {
            location.href = '/login';
        }
    }, [isUserAuth, isLoading]);

    useEffect(() => {
        getUserData()
            .then(({ firstName, lastName, avatar, errors }) => {
                setUserDataLoading(false);
                if (errors) {
                    setServerErrors(errors);
                } else {
                    setServerErrors([]);
                    setUserData({
                        firstName,
                        lastName,
                    });
                    setAvatarPreview(avatar);

                    formik.setValues({
                        firstName,
                        lastName,
                    });
                }
            })
            .catch(() => setUserDataLoading(false));
    }, []);

    if (isLoading || userDataLoading) {
        return <div className={Styles.container}>{spinnerGreen}</div>;
    }

    return (
        <div className={Styles.container}>
            <h3 className={Styles.title}>Change user profile:</h3>
            {avatarPreview ? (
                <div className={Styles.avatar_photo}>
                    <Image
                        src={avatarPreview}
                        alt='user_photo'
                        width={94}
                        height={94}
                    />
                </div>
            ) : (
                <Avatar
                    {...stringAvatar(
                        !firstName || !lastName
                            ? 'No Avatar'
                            : `${firstName[0].toUpperCase()} ${lastName[0].toUpperCase()}`,
                    )}
                    className={Styles.avatar_text}
                />
            )}

            <input
                accept='image/*'
                className={Styles.uploader}
                style={{ display: 'none' }}
                id='raised-button-file'
                type='file'
                onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                    if (evt.target.files && evt.target.files[0]) {
                        const photo = evt.target.files[0];
                        if (Math.ceil(photo.size / 1024) > avatarSize) {
                            setUploadError(true);
                        } else {
                            setUserAvatar(photo);
                            setUploadError(false);

                            const reader = new FileReader();
                            reader.readAsDataURL(photo);
                            reader.onload = () => {
                                setAvatarPreview(URL.createObjectURL(photo));
                            };
                        }
                    }
                }}
            />
            <label htmlFor='raised-button-file'>
                <Button component='span' className={Styles.upload_btn}>
                    Upload Avatar
                </Button>
            </label>
            {uploadError && (
                <span className={Styles.upload_error}>
                    {`Max file size was exceeded (${avatarSize} kb)`}
                </span>
            )}

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
                    onChange={(evt) => {
                        formik.handleChange(evt);
                        setUserData({
                            ...userData,
                            firstName: evt.target.value,
                        });
                    }}
                    onBlur={formik.handleBlur}
                    error={
                        formik.touched.firstName &&
                        Boolean(formik.errors.firstName)
                    }
                    helperText={
                        formik.touched.firstName && formik.errors.firstName
                    }
                    disabled={loading}
                    value={firstName}
                />
                <TextField
                    name='lastName'
                    id='lastName'
                    label='Last name'
                    variant='outlined'
                    fullWidth
                    margin='dense'
                    onChange={(evt) => {
                        formik.handleChange(evt);
                        setUserData({
                            ...userData,
                            lastName: evt.target.value,
                        });
                    }}
                    onBlur={formik.handleBlur}
                    error={
                        formik.touched.lastName &&
                        Boolean(formik.errors.lastName)
                    }
                    helperText={
                        formik.touched.lastName && formik.errors.lastName
                    }
                    disabled={loading}
                    value={lastName}
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
                        loading ||
                        Boolean(serverErrrors.length > 0)
                    }
                >
                    {loading ? spinnerWhite : 'Change profile'}
                </Button>
            </form>
        </div>
    );
};

export default Profile;
