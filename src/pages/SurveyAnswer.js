import Head from 'next/head'
import Sidelayout from './Sidelayout';
import dynamic from 'next/dynamic';




export default function Home() {

  const UserSurvey = dynamic(() => import('../../components/User/UserSurvey'), {
    ssr: false
  });

  return (
    <div className=''>
      <Head>
        <title>Swipe Select</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex">
      <Sidelayout />
      <UserSurvey />
      </div>
    </div>
  );
}
