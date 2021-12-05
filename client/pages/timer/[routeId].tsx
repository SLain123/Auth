import { useRouter } from 'next/router';
import { Header } from '../../features/header';
import { CurrentTimer } from '../../features/current_timer';

const TimerPage = () => {
    const router = useRouter();
    const { routeId } = router.query;

    return <CurrentTimer routeId={routeId as string} />;
};

TimerPage.getLayout = function getLayout(page: React.ReactElement) {
    return <Header>{page}</Header>;
};

export default TimerPage;
