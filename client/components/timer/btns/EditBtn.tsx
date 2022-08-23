import React, { FC } from 'react';
import Image from 'next/image';
import { useCookies } from 'react-cookie';

import { useControlTimer } from 'service/timers/ControlTimerService';
import { useAppSelector } from 'hooks';
import { getCurrentTimer } from 'features/current_timer/currentTimerSlice';

import Styles from '../Timer.module.scss';
import editIcon from 'public/icons/edit.svg';

export interface IEditBtn {
    isActive: boolean;
    changeEditStatus: (status: boolean) => void;
}

const EditBtn: FC<IEditBtn> = ({ changeEditStatus, isActive }) => {
    const { controlTimer } = useControlTimer();

    const currentTimer = useAppSelector(getCurrentTimer);
    const { timer } = currentTimer;
    const { _id, ownerId } = timer;

    const [cookies] = useCookies(['authData']);
    const isOwner = () =>
        cookies?.authData ? cookies.authData?.userId === ownerId : false;

    return (
        <button
            type='button'
            className={Styles.timer_control_btn}
            onClick={() => {
                changeEditStatus(true);
                isActive && controlTimer(_id, 'pause');
            }}
            disabled={!isOwner()}
        >
            <Image width={45} height={45} src={editIcon} alt='edit' />
        </button>
    );
};

export { EditBtn };
