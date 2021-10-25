import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Router from 'next/router';
import DotLoader from 'react-spinners/DotLoader';

import Styles from './Main.module.scss';

const Main = () => {
    const [cookies] = useCookies(['user-data']);
    const [loaded, setLoaded] = useState(false);
    const spinner = <DotLoader color='green' loading size={50} speedMultiplier={3} />;

    useEffect(() => {
        if (!cookies['user-data'] || !cookies['user-data'].token) {
            Router.push('/login');
        } else {
            setLoaded(true);
        }
    }, [cookies]);

    if (!loaded) {
        return <div className={Styles.container}>{spinner}</div>;
    }

    return <div className={Styles.container}>Success!</div>;
};

export default Main;
