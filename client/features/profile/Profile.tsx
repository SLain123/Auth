import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Avatar from '@mui/material/Avatar';
import { useProfileService } from '../../service/ProfileService';
import stringAvatar from './subFuncs';
import { getAuthSelector } from '../auth/authSlice';
import { Spinner } from '../../components/spinner';
import { useWindowDimensions, useAppSelector } from '../../hooks';

import Styles from './Profile.module.scss';

const Profile: React.FC = () => {
    const { width } = useWindowDimensions();
    const [nickName, setNickName] = useState('');
    const [userAvatar, setUserAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState(false);
    const [userDataLoading, setUserDataLoading] = useState(true);

    const authStatus = useAppSelector(getAuthSelector);
    const { isLoading, isUserAuth } = authStatus;

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

    const avatarSize = 200;
    const inputSize = width && width >= 768 ? 'medium' : 'small';
    const btnSize = width && width >= 768 ? 'large' : 'medium';

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
                    setNickName(nickName);
                    setAvatarPreview(avatar);

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
                        !nickName
                            ? 'No Avatar'
                            : `${nickName[0].toUpperCase()}}`,
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
                    {serverErrors.map((err) => (
                        <li key={err.msg} className={Styles.error_text}>
                            {err.msg}
                        </li>
                    ))}
                </ul>
                <TextField
                    name='nickName'
                    id='nickName'
                    label='Nick name'
                    variant='outlined'
                    fullWidth
                    margin='dense'
                    onChange={(evt) => {
                        formik.handleChange(evt);
                        setNickName(evt.target.value);
                    }}
                    onBlur={formik.handleBlur}
                    error={
                        formik.touched.nickName &&
                        Boolean(formik.errors.nickName)
                    }
                    helperText={
                        formik.touched.nickName && formik.errors.nickName
                    }
                    disabled={loading}
                    value={nickName}
                    size={inputSize}
                />
                <p className={Styles.status_text}>{resultMessage}</p>
                <Button
                    className={Styles.btn}
                    variant='contained'
                    color='success'
                    size={btnSize}
                    type='submit'
                    disabled={
                        Boolean(formik.errors.nickName) ||
                        loading ||
                        Boolean(serverErrors.length > 0)
                    }
                >
                    {loading ? WhiteSpin : 'Change profile'}
                </Button>
            </form>
        </div>
    );
};

export default Profile;
