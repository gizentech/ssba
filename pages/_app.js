import '@/styles/globals.css';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import SphereBg from '@/components/home/SphereBg';

// SSR時はレンダリングをスキップ、クライアント側で即座にマウント
function ClientOnly({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? children : null;
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAdmin = router.pathname.startsWith('/admin');
  const isHome = router.pathname === '/';

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="SSBA - Shootingstar Baseball Academy｜プロ野球選手の自主トレパートナーが指導する野球アカデミー。少人数制で小学生・中学生を対象としたクラスを開講中。" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Yuji+Syuku&display=swap" rel="stylesheet" />
        <title>SSBA - Shootingstar Baseball Academy</title>
      </Head>
      {isAdmin ? (
        <Component {...pageProps} />
      ) : (
        <>
          {isHome && <ClientOnly><SphereBg /></ClientOnly>}
          <Layout isHome={isHome}>
            <Component {...pageProps} />
          </Layout>
        </>
      )}
    </>
  );
}
