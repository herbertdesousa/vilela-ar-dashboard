import React from 'react';
import Head from 'next/head';

import { Nav } from '@/@view/components/Nav';

export default function Home() {
  return (
    <>
      <Head>
        <title>Início</title>
      </Head>

      <Nav />
    </>
  );
}
