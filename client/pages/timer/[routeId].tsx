import { useRouter } from 'next/router';
import { Header } from '../../features/header';
import { SingleTimer } from '../../features/single_timer';

const TimerPage = () => {
    const router = useRouter();
    const { routeId } = router.query;

    return <SingleTimer routeId={routeId} />;
};

TimerPage.getLayout = function getLayout(page: React.ReactElement) {
    return <Header>{page}</Header>;
};

export default TimerPage;
