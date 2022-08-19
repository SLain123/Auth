import React, { FC } from 'react';
import Button from '@mui/material/Button';

import Styles from './ErrorPanel.module.scss';

export interface IErrorPanel {
    message?: string;
}

const ErrorPanel: FC<IErrorPanel> = ({ message = 'Error!' }) => {
    return (
        <div className={`${Styles.error_panel}`}>
            <p>{message}</p>
            <p>Something was wrong. Please refresh the page.</p>

            <Button
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
