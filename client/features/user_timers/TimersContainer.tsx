import React from 'react';
import CreateTimer from './panels/CreateTimer';
import DisplayLastTimer from './panels/DisplayLastTimer';

const TimersContainer: React.FC = () => {
    return (
        <>
            <CreateTimer />
            <DisplayLastTimer />
        </>
    );
};

export default TimersContainer;
