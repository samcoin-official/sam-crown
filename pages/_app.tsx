import type { AppProps } from 'next/app';
import type { Session } from 'next-auth';

import ClientProviders from '@/providers';

import '../client/src/index.css';

type AppPageProps = {
  session?: Session | null;
};

export default function App({ Component, pageProps }: AppProps<AppPageProps>) {
  const { session = null, ...componentProps } = pageProps;

  return (
    <ClientProviders session={session}>
      <Component {...componentProps} />
    </ClientProviders>
  );
}
