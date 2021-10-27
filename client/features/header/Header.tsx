import React from 'react';
import { useCookies } from 'react-cookie';

import Styles from './Header.module.scss';

const Header: React.FC = ({ children }) => {
    const [cookies] = useCookies(['user-data']);

    return <header className={Styles.header}>{children}</header>;
};

export default Header;
