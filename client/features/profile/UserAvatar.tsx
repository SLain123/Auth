import React, { FC, useState } from 'react';
import Image from 'next/image';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { stringAvatar } from './subFuncs';

import Styles from './Profile.module.scss';

export interface IUserAvatar {
    avatarPreview: string | null;
    nickName?: string;
    saveAvatarPrewiev: (avatar: string | null) => void;
    saveAvatar: (avatar: File) => void;
}

const AVATAR_SUZE = 200;

const UserAvatar: FC<IUserAvatar> = ({
    avatarPreview,
    nickName,
    saveAvatarPrewiev,
    saveAvatar,
}) => {
    const [uploadSizeError, setUploadSizeError] = useState(false);

    const onUploadAvatar = (evt: React.ChangeEvent<HTMLInputElement>) => {
        if (evt.target.files && evt.target.files[0]) {
            const photo = evt.target.files[0];
            if (Math.ceil(photo.size / 1024) > AVATAR_SUZE) {
                setUploadSizeError(true);
            } else {
                saveAvatar(photo);
                setUploadSizeError(false);

                const reader = new FileReader();
                reader.readAsDataURL(photo);
                reader.onload = () => {
                    saveAvatarPrewiev(URL.createObjectURL(photo));
                };
            }
        }
    };

    const avatarIcon = avatarPreview ? (
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
                !nickName ? 'No Avatar' : `${nickName[0].toUpperCase()}}`,
            )}
            className={Styles.avatar_text}
        />
    );

    return (
        <>
            <h3 className={Styles.title}>Change user profile:</h3>
            {avatarIcon}
            <input
                accept='image/*'
                className={Styles.uploader}
                style={{ display: 'none' }}
                id='raised-button-file'
                type='file'
                onChange={onUploadAvatar}
            />
            <label htmlFor='raised-button-file'>
                <Button component='span' className={Styles.upload_btn}>
                    Upload Avatar
                </Button>
            </label>
            {uploadSizeError && (
                <span className={Styles.upload_error}>
                    {`Max file size was exceeded (${AVATAR_SUZE} kb)`}
                </span>
            )}
        </>
    );
};

export { UserAvatar };
