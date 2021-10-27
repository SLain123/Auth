import { Main } from '../features/main';
import { Header } from '../features/header';

export default function MainPage() {
    return <Main />;
}

MainPage.getLayout = function getLayout(page: React.ReactElement) {
    return <Header>{page}</Header>;
};
