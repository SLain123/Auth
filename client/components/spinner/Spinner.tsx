import React from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import DotLoader from 'react-spinners/DotLoader';
import ClipLoader from 'react-spinners/ClipLoader';

const Spinner = () => {
    const WhiteSpin = <BeatLoader color='white' loading size={10} />;
    const GreenSpin = (
        <DotLoader color='green' loading size={50} speedMultiplier={3} />
    );
    const curcleSpin = (size: number, color: string) => (
        <ClipLoader color={color} loading size={size} />
    );

    return { WhiteSpin, GreenSpin, curcleSpin };
};

export { Spinner };
