import React, { FC } from 'react';

import Styles from './FormWrapper.module.scss';

export interface IFormWrapper {
    children: React.ReactNode;
    title?: string;
    height?: number;
}

const FormWrapper: FC<IFormWrapper> = ({ children, title = '', height }) => {
    return (
        <div className={Styles.form_container}>
            <div className={Styles.form_head}>{title}</div>
            <div className={Styles.form_content} style={{ height }}>
                {children}
            </div>
        </div>
    );
};

export { FormWrapper };
