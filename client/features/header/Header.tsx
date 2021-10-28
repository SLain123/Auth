import React, { useEffect } from 'react';
import Link from 'next/link';
import { useCookies } from 'react-cookie';

import Styles from './Header.module.scss';

const Header: React.FC = ({ children }) => {
    const [cookies] = useCookies(['token']);
    const navListAuth = [
        { name: 'Home', link: '/' },
        { name: 'Profile', link: '/profile' },
    ];
    const navListGuest = [
        { name: 'Home', link: '/' },
        { name: 'Login', link: '/login' },
        { name: 'Registration', link: '/reg' },
    ];

    const navList = cookies.token
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

    return (
        <>
            <header className={Styles.header}>
                <ul className={Styles.menu}>
                    {navList}
                    {cookies.token && (
                        <li key='logout'>
                            <button type='button'>Log out</button>
                        </li>
                    )}
                </ul>
            </header>
            {children}
        </>
    );
};

export default Header;
