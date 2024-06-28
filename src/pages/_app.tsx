import React from 'react';
import Head from 'next/head';

import 'tailwindcss/tailwind.css';
import '../styles/main.css';

import SWRConfig from '@/lib/SWRConfig';
import Hooks from '@/hook';

const App = ({ Component, pageProps }: any) => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:wght@400;700&display=swap"
        rel="stylesheet"
      />
    </Head>

    <SWRConfig>
      <Hooks>
        <Component {...pageProps} />
      </Hooks>
    </SWRConfig>
  </>
);

export default App;
