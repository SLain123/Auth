import React, { useState, useEffect, FC } from 'react';
import { HamburgerIcon } from 'react-hamburger-icon';
import Link from 'next/link';
import { useCookies } from 'react-cookie';
import { useScrollBlock } from 'hooks';

import Styles from './Hamburger.module.scss';

interface NavListI {
    name: string;
    link: string;
}

interface HamburgerI {
    isUserAuth: boolean;
    navListAuth: NavListI[];
    navListGuest: NavListI[];
}

const Hamburger: FC<HamburgerI> = ({
    isUserAuth,
    navListAuth,
    navListGuest,
}) => {
    const [_cookies, _setCookie, removeCookie] = useCookies(['authData']);
    const [isOpen, setOpen] = useState(false);
    const [blockScroll, allowScroll] = useScrollBlock();

    const menuStyle = isOpen ? Styles.hamburger_menu_btn_active : '';
    const navStyle = isOpen ? Styles.hamburger_nav_container_active : '';

    const setLogout = () => () => {
        removeCookie('authData');
        location.href = '/login';
    };

    const toggleMenu = () => () => setOpen(!isOpen);

    const closeMenu =
        () => (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            const elem = evt.target as HTMLDivElement;
            if (elem.tagName !== 'UL') {
                setOpen(false);
            }
        };

    useEffect(() => {
        isOpen ? blockScroll() : allowScroll();
    }, [isOpen]);

    return (
        <div className={Styles.hamburger_container}>
            <div className={`${Styles.hamburger_menu_btn} ${menuStyle}`}>
                <HamburgerIcon open={isOpen} onClick={toggleMenu()} />
            </div>
            <div
                className={`${Styles.hamburger_nav_container} ${navStyle}`}
                onClick={closeMenu()}
            >
                <ul className={Styles.hamburger_nav_list}>
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
            </div>
        </div>
    );
};

export { Hamburger };
