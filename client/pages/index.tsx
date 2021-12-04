import { TimersContainer } from '../features/user_timers';
import { Header } from '../features/header';

export default function MainPage() {
    return <TimersContainer />;
}

MainPage.getLayout = function getLayout(page: React.ReactElement) {
    return <Header>{page}</Header>;
};
