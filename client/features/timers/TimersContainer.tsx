import React from 'react';
import CreateTimerForm from './panels/CreateTimerPanel';
import DisplayTimersPanel from './panels/DisplayTimersPanel';

import Styles from './Timers.module.scss';

const TimersContainer: React.FC = () => {
    return (
        <>
            <CreateTimerForm />
            <DisplayTimersPanel />
        </>
    );
};

export default TimersContainer;
