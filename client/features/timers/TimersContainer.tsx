import React from 'react';
import CreateTimer from './panels/CreateTimer';
import DisplayLastTimer from './panels/DisplayLastTimer';

import Styles from './Timers.module.scss';

const TimersContainer: React.FC = () => {
    return (
        <>
            <CreateTimer />
            <DisplayLastTimer />
        </>
    );
};

export default TimersContainer;
