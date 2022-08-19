import React, { FC } from 'react';
import { CreateTimer } from './panels/CreateTimer';
import { DisplayLastTimer } from './panels/DisplayLastTimer';

const TimersContainer: FC = () => {
    return (
        <>
            <CreateTimer />
            <DisplayLastTimer />
        </>
    );
};

export { TimersContainer };
