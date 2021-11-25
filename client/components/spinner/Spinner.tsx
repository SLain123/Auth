import React from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import DotLoader from 'react-spinners/DotLoader';
import ClipLoader from 'react-spinners/ClipLoader';

const Spinner = () => {
    const WhiteSpin = <BeatLoader color='white' loading size={10} />;
    const GreenSpin = (
        <DotLoader color='green' loading size={50} speedMultiplier={3} />
    );
    const curcleGreenSpin = <ClipLoader color='green' loading size={70} />;

    return { WhiteSpin, GreenSpin, curcleGreenSpin };
};

export default Spinner;
