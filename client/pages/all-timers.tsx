import DisplayAllTimers from '../features/timers/panels/DisplayAllTimers';
import { Header } from '../features/header';

export default function MainPage() {
    return <DisplayAllTimers />;
}

MainPage.getLayout = function getLayout(page: React.ReactElement) {
    return <Header>{page}</Header>;
};
