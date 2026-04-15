import '@/styles/globals.css';
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import AdminHeader from '@/components/layout/AdminHeader';
import AdminAuth from '@/components/layout/AdminAuth';

const GA_ID = 'G-L9LHJ26HQC';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAdmin = router.pathname.startsWith('/admin');
  const isHome = router.pathname === '/';

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* デフォルトのfavicon・フォント（全ページ共通） */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Yuji+Syuku&display=swap" rel="stylesheet" />
        {/* 各ページの SeoHead が上書きするためデフォルトのみ */}
        <meta name="robots" content="index, follow" />
      </Head>
      {isAdmin ? (
        <AdminAuth>
          <AdminHeader />
          <Component {...pageProps} />
        </AdminAuth>
      ) : (
        <Layout isHome={isHome}>
          <Component {...pageProps} />
        </Layout>
      )}
    </>
  );
}
