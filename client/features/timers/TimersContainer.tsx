import React from 'react';
import CreateTimerForm from './panels/CreateTimerPanel';
import DisplayLastTimerPanel from './panels/DisplayLastPanel';

import Styles from './Timers.module.scss';

const TimersContainer: React.FC = () => {
    return (
        <>
            <CreateTimerForm />
            <DisplayLastTimerPanel />
        </>
    );
};

export default TimersContainer;
