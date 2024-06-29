import React from 'react';
import Head from 'next/head';

import { Nav } from '@/@view/components/Nav';

import { DocumentListSideMenu } from '@/modules/Document/DocumentList';

const Documents: React.FC = () => {
  return (
    <>
      <Head>
        <title>Documentos</title>
      </Head>

      <div className="flex max-h-screen">
        <Nav />

        <div className="flex min-h-full">
          <DocumentListSideMenu />
        </div>
      </div>
    </>
  );
};

export default Documents;
