import '@/styles/globals.css'
import Head from 'next/head';

export default function SwipeSelect({ Component, pageProps }) {
  return (
    <>
      <Head>
      
        <meta property="og:title" content="Swipe Select" />
        <meta property="og:description" content="Swipe Select" />
        <meta property="og:image" content="" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

