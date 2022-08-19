import { AllTimersTable } from '../features/all_timers_table/AllTimersTable';
import { Header } from '../features/header';

export default function AllTimerPage() {
    return <AllTimersTable />;
}

AllTimerPage.getLayout = function getLayout(page: React.ReactElement) {
    return <Header>{page}</Header>;
};
