import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useTokenCheck } from '../../hooks/useTokenCheck';
import { useAppSelector } from '../../hooks';
import { getAuthSelector } from '../auth/authSlice';
import { useWindowDimensions, useRefreshTimers } from '../../hooks';
import { Navigate } from '../navigate';
import { Hamburger } from '../hamburger';

import Styles from './Header.module.scss';

const Header: React.FC = ({ children }) => {
    const [cookies] = useCookies(['authData']);
    const { width } = useWindowDimensions();
    const { refreshTimers } = useRefreshTimers();

    const checkTokenService = useTokenCheck();

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
            <Hamburger
                isUserAuth={isUserAuth}
                navListAuth={navListAuth}
                navListGuest={navListGuest}
            />
        );

    useEffect(() => {
        const { checkToken } = checkTokenService;
        checkToken(cookies.authData ? cookies.authData?.token : null);
    }, []);

    useEffect(() => {
        if (isUserAuth) {
            refreshTimers();
        }
    }, [isUserAuth]);

    return (
        <>
            <header className={Styles.header}>{navMenu}</header>
            <main className={Styles.main_container}>{children}</main>
        </>
    );
};

export default Header;
