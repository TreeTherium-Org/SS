import Head from 'next/head'
import Layout from './layout';
import Landingpage from '../../components/Landingpage'



export default function Home() {
  return (
    <div className=''>
      <Head>
        <title>Swipe Select</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout />
      <Landingpage />
    </div>
  );
}
