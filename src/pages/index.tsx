import React from 'react';
import Head from 'next/head';

import { Nav } from '@/components';

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Início</title>
      </Head>

      <Nav />
    </>
  );
};

export default Home;
