import type { AppProps } from 'next/app';
import type { Session } from 'next-auth';

import ClientProviders from '@/providers';

export default function MyApp({
  Component,
  pageProps,
}: AppProps<{ session: Session | null }>) {
  const { session = null, ...pagePropsWithoutSession } = pageProps;

  return (
    <ClientProviders session={session}>
      <Component {...pagePropsWithoutSession} />
    </ClientProviders>
  );
}
