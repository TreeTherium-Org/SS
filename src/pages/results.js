import Head from 'next/head'
import Sidelayout from './Sidelayout';
import Results from '../../components/results'



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
      <Results />
      </div>
    </div>
  );
}
