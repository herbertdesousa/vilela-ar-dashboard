import React from 'react';
import { useRouter } from 'next/router';

import { useDocument } from '@/hook/document';

import { Select } from '@/components';

import DocumentEditorPreviewerHeader from './DocumentEditorPreviewerHeader';
import DocumentEditorPreviewerPayment from './DocumentEditorPreviewerPayment';
import DocumentEditorPreviewerBlock from './DocumentEditorPreviewerBlock';
import DocumentEditorPreviewerBankDetails from './DocumentEditorPreviewerBankDetails';

const DOCUMENT_HEIGHT = 842;

const DocumentEditorPreviewer: React.FC = () => {
  const router = useRouter();

  const { layers, previewPages, pdf } = useDocument();

  const pushDocumentoEditorPage = () => {
    router.push('/documents/editor');
  };

  return (
    <section className="flex flex-1 relative items-center justify-center bg-accent-1 w-full min-h-full overflow-x-scroll no-scroll">
      <div
        role="button"
        tabIndex={0}
        className="absolute w-full h-full"
        onClick={pushDocumentoEditorPage}
        onKeyDown={pushDocumentoEditorPage}
      >
        {}
      </div>

      <div
        id="page"
        style={{
          width: 595,
          zoom: 0.9,
          height: DOCUMENT_HEIGHT,
          transform: `scale(${pdf.isGeneratingPDF ? '4, 4' : '1, 1'})`,
        }}
        className="relative bg-accent-0 rounded z-10"
      >
        {previewPages.activeName !== 'Dados Bancários' && (
          <div>
            <DocumentEditorPreviewerHeader
              type={previewPages.activeIndex !== 0 ? 'small' : 'with-header'}
            />
            <ul className="px-10 pt-8">
              {layers.blocksInPage[previewPages.activeIndex]
                .sort((a: any, b: any) => a.order - b.order)
                .map((block, blockIndex) => (
                  <div key={block.id}>
                    {block.type === 'payment' && (
                      <DocumentEditorPreviewerPayment block={block} />
                    )}
                    {block.type === 'block' && (
                      <DocumentEditorPreviewerBlock
                        block={block}
                        blockIndex={blockIndex}
                      />
                    )}
                  </div>
                ))}
            </ul>
          </div>
        )}
        {previewPages.activeName === 'Dados Bancários' && (
          <DocumentEditorPreviewerBankDetails />
        )}
      </div>

      <div className="absolute left-6 bottom-6">
        <Select
          name="pages"
          label=""
          hasFilter={false}
          value={previewPages.value.find(i => i.isActive)?.label}
          data={previewPages.value.map(i => ({ ...i, value: i.label }))}
          onSelect={payload => previewPages.changePage(payload.value)}
          className="w-48"
          dropdownStyle={{ bottom: 44 }}
        />
      </div>
    </section>
  );
};

export default DocumentEditorPreviewer;
