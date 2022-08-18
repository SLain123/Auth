import React, { FC } from 'react';
import Button from '@mui/material/Button';

import Styles from './ErrorPanel.module.scss';

export interface IErrorPanel {
    message: string;
}

const ErrorPanel: FC<IErrorPanel> = ({ message }) => {
    return (
        <div className={`${Styles.form} ${Styles.form_with_error}`}>
            <p>{message}=</p>
            <p>Something was wrong</p>

            <Button
                className={Styles.create_btn}
                variant='contained'
                color='success'
                size='large'
                type='button'
                onClick={() => location.reload()}
            >
                Refresh page
            </Button>
        </div>
    );
};

export { ErrorPanel };
