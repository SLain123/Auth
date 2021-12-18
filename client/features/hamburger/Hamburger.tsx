import React, { useState } from 'react';
import { HamburgerIcon } from 'react-hamburger-icon';

import Styles from './Hamburger.module.scss';

const Hamburger: React.FC = () => {
    const [isOpen, setOpen] = useState(false);

    return (
        <div className={Styles.hamburger_container}>
            <div className={Styles.hamburger_menu_btn}>
                <HamburgerIcon
                    open={isOpen}
                    onClick={() => setOpen(!isOpen)}
                />
            </div>
        </div>
    );
};

export default Hamburger;
