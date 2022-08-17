import { Login } from 'features/login';
import { Header } from 'features/header';

export default function LoginPage() {
    return <Login />;
}

LoginPage.getLayout = function getLayout(page: React.ReactElement) {
    return <Header>{page}</Header>;
};
