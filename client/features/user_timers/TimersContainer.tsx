import React, { FC } from 'react';

import { CreateTimer } from './panels/CreateTimer';
import { DisplayLastTimer } from './panels/DisplayLastTimer';
import { useAppSelector } from 'hooks';
import { getAuthSelector } from 'features/auth/authSlice';
import { Spinner } from 'components/spinner';
import { NoAuthWarning } from './panels/NoAuthWarning';

import Styles from './Timers.module.scss';

const TimersContainer: FC = () => {
    const authStatus = useAppSelector(getAuthSelector);
    const { isLoading, isUserAuth } = authStatus;

    const { PurpleSpin } = Spinner();

    if (isLoading) {
        return (
            <div className={Styles.container_not_auth_spin}>{PurpleSpin}</div>
        );
    }

    if (!isUserAuth) {
        return <NoAuthWarning />;
    }

    return (
        <>
            <CreateTimer />
            <DisplayLastTimer />
        </>
    );
};

export { TimersContainer };
