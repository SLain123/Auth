import '../styles/globals.css';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import { CookiesProvider } from 'react-cookie';

type NextPageWithLayout = NextPage & {
    getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? ((page) => page);

    return getLayout(
        <CookiesProvider>
            <Component {...pageProps} />,
        </CookiesProvider>,
    );
}
