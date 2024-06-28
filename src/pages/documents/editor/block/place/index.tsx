import React from 'react';
import Head from 'next/head';

import {
  DocumentEditorNav,
  DocumentEditorPreviewer,
} from '@/modules/Document/DocumentEditor';
import { DocumentEditorSideMenuBlockPlace } from '@/modules/Document/DocumentEditor/DocumentEditorSideMenu';

const EditorBlockPlace: React.FC = () => {
  return (
    <>
      <Head>
        <title>Documentos Editor - Bloco</title>
      </Head>

      <DocumentEditorNav />

      <div className="flex" style={{ height: 'calc(100vh - 96px)' }}>
        <DocumentEditorPreviewer />

        <DocumentEditorSideMenuBlockPlace />
      </div>
    </>
  );
};

export default EditorBlockPlace;
