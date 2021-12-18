import React from 'react';
import Link from 'next/link';
import { useCookies } from 'react-cookie';

import Styles from './Navigate.module.scss';

interface NavListI {
    name: string;
    link: string;
}

interface NavigateI {
    isUserAuth: boolean;
    navListAuth: NavListI[];
    navListGuest: NavListI[];
}

const Navigate: React.FC<NavigateI> = ({
    isUserAuth,
    navListAuth,
    navListGuest,
}) => {
    const [_cookies, _setCookie, removeCookie] = useCookies(['authData']);

    const setLogout = () => () => {
        removeCookie('authData');
        location.href = '/login';
    };

    return (
        <ul className={Styles.menu}>
            {isUserAuth
                ? navListAuth.map(({ name, link }) => (
                      <li key={name}>
                          <Link href={link}>{name}</Link>
                      </li>
                  ))
                : navListGuest.map(({ name, link }) => (
                      <li key={name}>
                          <Link href={link}>{name}</Link>
                      </li>
                  ))}
            {isUserAuth && (
                <li key='logout'>
                    <button
                        className={Styles.logout_btn}
                        type='button'
                        onClick={setLogout()}
                    >
                        Log out
                    </button>
                </li>
            )}
        </ul>
    );
};

export default Navigate;
