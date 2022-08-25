import React, { FC } from 'react';

import { CreateTimer } from './panels/CreateTimer';
import { DisplayLastTimer } from './panels/DisplayLastTimer';
import { useAppSelector } from 'hooks';
import { getAuthSelector } from 'features/auth/authSlice';
import { Spinner } from 'components/spinner';

import Styles from './Timers.module.scss';

const TimersContainer: FC = () => {
    const authStatus = useAppSelector(getAuthSelector);
    const { isLoading } = authStatus;

    const { CurcleSpin } = Spinner();

    if (isLoading) {
        return (
            <div className={`${Styles.container} ${Styles.container_not_auth}`}>
                {CurcleSpin(100)}
            </div>
        );
    }

    return (
        <>
            <CreateTimer />
            <DisplayLastTimer />
        </>
    );
};

export { TimersContainer };
