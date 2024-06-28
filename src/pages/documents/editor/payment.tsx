import React from 'react';
import Head from 'next/head';

import {
  DocumentEditorNav,
  DocumentEditorPreviewer,
} from '@/modules/Document/DocumentEditor';
import { DocumentEditorSideMenuPayment } from '@/modules/Document/DocumentEditor/DocumentEditorSideMenu';

const Payment: React.FC = () => {
  return (
    <>
      <Head>
        <title>Documentos Editor - Pagamento</title>
      </Head>

      <DocumentEditorNav />

      <div className="flex" style={{ height: 'calc(100vh - 96px)' }}>
        <DocumentEditorPreviewer />

        <DocumentEditorSideMenuPayment />
      </div>
    </>
  );
};

export default Payment;
