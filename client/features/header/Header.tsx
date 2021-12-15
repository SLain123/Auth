import React, { useEffect } from 'react';
import Link from 'next/link';
import { useCookies } from 'react-cookie';
import useCheckTokenService from '../../service/TokenCheckService';
import { useGetUserTimers } from '../../service/TimerService';
import { useAppSelector } from '../../hooks/useAppSelector';
import { getAuthSelector } from '../auth/authSlice';

import Styles from './Header.module.scss';

const Header: React.FC = ({ children }) => {
    const [cookies, _setCookie, removeCookie] = useCookies(['authData']);
    const checkTokenService = useCheckTokenService(
        cookies.authData ? cookies.authData.token : null,
    );
    const getUserTimersService = useGetUserTimers();
    const { getUserTimers } = getUserTimersService;

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
    const authStatus = useAppSelector(getAuthSelector);
    const { isUserAuth } = authStatus;

    const navList = isUserAuth
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
        const { checkToken } = checkTokenService;
        checkToken();
    }, []);

    useEffect(() => {
        isUserAuth && getUserTimers();
    }, [isUserAuth]);

    return (
        <>
            <header className={Styles.header}>
                <ul className={Styles.menu}>
                    {navList}
                    {isUserAuth && (
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
            <main className={Styles.main_container}>{children}</main>
        </>
    );
};

export default Header;
