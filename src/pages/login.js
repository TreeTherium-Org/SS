import Head from 'next/head'
import Login from '../../components/login'
import Layout from './layout';



export default function Home() {
  return (
    <div className=''>
      <Head>
        <title>Swipe Select</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout />
      <Login />
    </div>
  );
}
