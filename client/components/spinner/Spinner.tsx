import React from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import DotLoader from 'react-spinners/DotLoader';
import ClipLoader from 'react-spinners/ClipLoader';

const Spinner = () => {
    const WhiteSpin = <BeatLoader color='white' loading size={10} />;
    const PurpleSpin = (
        <DotLoader
            color='rgba(82, 0, 255, 0.9)'
            loading
            size={50}
            speedMultiplier={3}
        />
    );
    const CurcleSpin = (size: number, color = 'rgba(82, 0, 255, 0.9)') => (
        <ClipLoader color={color} loading size={size} />
    );

    return { WhiteSpin, PurpleSpin, CurcleSpin };
};

export { Spinner };
