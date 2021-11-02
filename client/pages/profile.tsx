import { Profile } from '../features/profile';
import { Header } from '../features/header';

export default function ProfilePage() {
    return <Profile />;
}

ProfilePage.getLayout = function getLayout(page: React.ReactElement) {
    return <Header>{page}</Header>;
};
