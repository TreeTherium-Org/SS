import Head from 'next/head'
import Sidelayout from './Sidelayout';
import Survey from '../../components/Survey'



export default function Home() {
  
  return (
    <div className=''>
      <Head>
        <title>Swipe Select</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex">
      <Sidelayout />
      <Survey />
      </div>
    </div>
  );
}
