import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCookies } from 'react-cookie';
import useCheckTokenService from '../../service/TokenCheckService';
import { useGetUserTimers } from '../../service/TimerService';
import { useAppSelector } from '../../hooks/useAppSelector';
import { getAuthSelector } from '../auth/authSlice';

import Styles from './Header.module.scss';

const Header: React.FC = ({ children }) => {
    const [cookies, _setCookie, removeCookie] = useCookies(['authData']);
    const [contentLoaded, setContentLoaded] = useState(false);
    const checkTokenService = useCheckTokenService(
        cookies.authData ? cookies.authData.token : null,
    );
    const getUserTimersService = useGetUserTimers();
    const { getTimers } = getUserTimersService;

    const navListAuth = [
        { name: 'Home', link: '/' },
        { name: 'Profile', link: '/profile' },
    ];
    const navListGuest = [
        { name: 'Home', link: '/' },
        { name: 'Login', link: '/login' },
        { name: 'Registration', link: '/reg' },
    ];
    const authStatus = useAppSelector(getAuthSelector);
    const { isUserAuth } = authStatus;

    const navList =
        isUserAuth && contentLoaded
            ? navListAuth.map(({ name, link }) => (
                  <li key={name}>
                      <Link href={link}>{name}</Link>
                  </li>
              ))
            : navListGuest.map(({ name, link }) => (
                  <li key={name}>
                      <Link href={link}>{name}</Link>
                  </li>
              ));

    useEffect(() => {
        if (document.readyState === 'interactive') {
            setContentLoaded(true);
        }
    }, []);

    useEffect(() => {
        const { checkToken } = checkTokenService;
        checkToken();
    }, []);

    useEffect(() => {
        isUserAuth && getTimers();
    }, [isUserAuth]);

    return (
        <>
            <header className={Styles.header}>
                <ul className={Styles.menu}>
                    {navList}
                    {isUserAuth && contentLoaded && (
                        <li key='logout'>
                            <button
                                className={Styles.logout_btn}
                                type='button'
                                onClick={() => {
                                    removeCookie('authData');
                                    location.href = '/login';
                                }}
                            >
                                Log out
                            </button>
                        </li>
                    )}
                </ul>
            </header>
            {children}
        </>
    );
};

export default Header;
