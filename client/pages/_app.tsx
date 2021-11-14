import '../styles/globals.css';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import { CookiesProvider } from 'react-cookie';
import { wrapper } from '../store/store';

type NextPageWithLayout = NextPage & {
    getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
    const getLayout = Component.getLayout ?? ((page) => page);

    return getLayout(
        <CookiesProvider>
            <Component {...pageProps} />
        </CookiesProvider>,
    );
};

export default wrapper.withRedux(MyApp);
