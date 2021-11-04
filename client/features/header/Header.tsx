import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCookies } from 'react-cookie';

import Styles from './Header.module.scss';

const Header: React.FC = ({ children }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['authData']);
    const [contentLoaded, setContentLoaded] = useState(false);
    const navListAuth = [
        { name: 'Home', link: '/' },
        { name: 'Profile', link: '/profile' },
    ];
    const navListGuest = [
        { name: 'Home', link: '/' },
        { name: 'Login', link: '/login' },
        { name: 'Registration', link: '/reg' },
    ];

    const navList =
        cookies.authData && contentLoaded
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

    return (
        <>
            <header className={Styles.header}>
                <ul className={Styles.menu}>
                    {navList}
                    {cookies.authData && contentLoaded && (
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
