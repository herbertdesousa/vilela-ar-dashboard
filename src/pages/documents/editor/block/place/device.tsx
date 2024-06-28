import React from 'react';
import Head from 'next/head';

import {
  DocumentEditorNav,
  DocumentEditorPreviewer,
} from '@/modules/Document/DocumentEditor';
import { DocumentEditorSideMenuBlockPlaceDevice } from '@/modules/Document/DocumentEditor/DocumentEditorSideMenu';

const EditorBlockPlaceDevice: React.FC = () => {
  return (
    <>
      <Head>
        <title>Documentos Editor - Bloco</title>
      </Head>

      <DocumentEditorNav />

      <div className="flex" style={{ height: 'calc(100vh - 96px)' }}>
        <DocumentEditorPreviewer />

        <DocumentEditorSideMenuBlockPlaceDevice />
      </div>
    </>
  );
};

export default EditorBlockPlaceDevice;
