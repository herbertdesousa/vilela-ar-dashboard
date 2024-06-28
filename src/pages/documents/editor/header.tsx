import React from 'react';
import Head from 'next/head';

import {
  DocumentEditorNav,
  DocumentEditorPreviewer,
} from '@/modules/Document/DocumentEditor';
import { DocumentEditorSideMenuHeader } from '@/modules/Document/DocumentEditor/DocumentEditorSideMenu';

const EditorHeader: React.FC = () => {
  return (
    <>
      <Head>
        <title>Documentos Editor - Cabeçalho</title>
      </Head>

      <DocumentEditorNav />

      <div className="flex" style={{ height: 'calc(100vh - 96px)' }}>
        <DocumentEditorPreviewer />

        <DocumentEditorSideMenuHeader />
      </div>
    </>
  );
};

export default EditorHeader;
