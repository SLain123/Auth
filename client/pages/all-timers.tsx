import DisplayAllTimers from '../features/user_timers/panels/DisplayAllTimers';
import { Header } from '../features/header';

export default function AllTimerPage() {
    return <DisplayAllTimers />;
}

AllTimerPage.getLayout = function getLayout(page: React.ReactElement) {
    return <Header>{page}</Header>;
};
