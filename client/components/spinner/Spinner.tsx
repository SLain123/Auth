import React from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import DotLoader from 'react-spinners/DotLoader';

const Spinner = () => {
    const WhiteSpin = <BeatLoader color='white' loading size={10} />;
    const GreenSpin = (
        <DotLoader color='green' loading size={50} speedMultiplier={3} />
    );

    return { WhiteSpin, GreenSpin };
};

export default Spinner;
