import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import useCheckTokenService from '../../service/TokenCheckService';
import { useGetUserTimers } from '../../service/TimerService';
import { useAppSelector } from '../../hooks/useAppSelector';
import { getAuthSelector } from '../auth/authSlice';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { Navigate } from '../navigate';
import { Hamburger } from '../hamburger';

import Styles from './Header.module.scss';

const Header: React.FC = ({ children }) => {
    const [cookies] = useCookies(['authData']);
    const { width } = useWindowDimensions();

    const checkTokenService = useCheckTokenService(
        cookies.authData ? cookies.authData.token : null,
    );
    const getUserTimersService = useGetUserTimers();
    const { getUserTimers } = getUserTimersService;

    const authStatus = useAppSelector(getAuthSelector);
    const { isUserAuth } = authStatus;

    const navListAuth = [
        { name: 'Home', link: '/' },
        { name: 'Profile', link: '/profile' },
        { name: 'All Timers', link: '/all-timers' },
    ];
    const navListGuest = [
        { name: 'Home', link: '/' },
        { name: 'Login', link: '/login' },
        { name: 'Registration', link: '/reg' },
    ];

    const navMenu =
        width && width >= 768 ? (
            <Navigate
                isUserAuth={isUserAuth}
                navListAuth={navListAuth}
                navListGuest={navListGuest}
            />
        ) : (
            <Hamburger />
        );

    useEffect(() => {
        const { checkToken } = checkTokenService;
        checkToken();
    }, []);

    useEffect(() => {
        isUserAuth && getUserTimers();
    }, [isUserAuth]);

    return (
        <>
            <header className={Styles.header}>{navMenu}</header>
            <main className={Styles.main_container}>{children}</main>
        </>
    );
};

export default Header;
