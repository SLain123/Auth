import React, { FC } from 'react';
import Link from 'next/link';

import Styles from '../Timers.module.scss';

const NoAuthWarning: FC = () => {
    return (
        <div className={`${Styles.container} ${Styles.container_not_auth}`}>
            <div className={Styles.form_wrapper_mini}>
                <div className={Styles.form_content_mini}>
                    <span className={Styles.info_message}>
                        If you want to create a new personal timer, you need to
                        register or log in.
                    </span>
                    <Link href='/login'>
                        <a className={Styles.login_btn}>Log in</a>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export { NoAuthWarning };
