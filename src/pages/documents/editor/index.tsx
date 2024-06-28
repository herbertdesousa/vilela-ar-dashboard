import React from 'react';
import Head from 'next/head';

import {
  DocumentEditorNav,
  DocumentEditorPreviewer,
} from '@/modules/Document/DocumentEditor';
import { DocumentEditorSideMenuGeneral } from '@/modules/Document/DocumentEditor/DocumentEditorSideMenu';

const Editor: React.FC = () => {
  return (
    <>
      <Head>
        <title>Documentos Editor</title>
      </Head>

      <DocumentEditorNav />

      <div className="flex" style={{ height: 'calc(100vh - 96px)' }}>
        <DocumentEditorPreviewer />

        <DocumentEditorSideMenuGeneral />
      </div>
    </>
  );
};

export default Editor;
