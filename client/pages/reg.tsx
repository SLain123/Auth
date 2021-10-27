import { Register } from '../features/register';
import { Header } from '../features/header';

export default function RegisterPage() {
    return <Register />;
}

RegisterPage.getLayout = function getLayout(page: React.ReactElement) {
    return <Header>{page}</Header>;
};
