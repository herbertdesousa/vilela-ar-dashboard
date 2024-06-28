import React from 'react';
import { useRouter } from 'next/router';

import { useDocument } from '@/hook/document';
import { useFormikContext } from 'formik';

import { Button, ListItem } from '@/components';
import { MdAdd, MdMoreVert } from 'react-icons/md';
import { IDocumentFormData } from '@/hook/document/types/DocumentFormData';
import { DOCUMENT_BLOCK_INITIALS } from '@/hook/document/wrapper';

const DocumentListSideMenu: React.FC = () => {
  const router = useRouter();

  const { setValues } = useFormikContext<IDocumentFormData>();
  const { documents, deleteDocument, startEditor, duplicateDocument } =
    useDocument();

  const pushEditorPage = (item: IDocumentFormData) => {
    startEditor(item);
    router.push('/documents/editor');
  };

  return (
    <section
      className="border-r border-accent-2 min-h-full"
      style={{ width: 512 }}
    >
      <div className="px-6 flex justify-between items-center my-8">
        <h2 className="font-merriweather font-bold text-xl">
          Documentos&nbsp;
          <span className="text-accent-3">
            {documents?.length ? `(${documents.length})` : ''}
          </span>
        </h2>

        <Button
          variant="outline"
          size="sm"
          leftIcon={MdAdd}
          onClick={() => pushEditorPage(DOCUMENT_BLOCK_INITIALS)}
        >
          Adicionar
        </Button>
      </div>
      <ul className="overflow-y-scroll no-scroll pb-6 min-h-full">
        {!documents.length && (
          <p className="w-full text-center text-accent-3 mt-6">
            Nenhum Documento
          </p>
        )}
        <div className="px-6">
          {documents.map((item, index) => (
            <ListItem
              title={item.title}
              key={item.id}
              onClick={() => pushEditorPage(item)}
              rightComponent={{
                icon: MdMoreVert,
                dropdown: {
                  data: [
                    {
                      item: 'Duplicar',
                      value: 'duplicate',
                      onSelect: () => duplicateDocument(item.id),
                    },
                    {
                      item: <span className="text-red">Deletar</span>,
                      onSelect: () => deleteDocument(item.id),
                      value: 'delete',
                    },
                  ],
                },
              }}
              showBottomIndicator={documents.length - 1 !== index}
              className={index !== 0 && 'mt-2'}
            />
          ))}
        </div>
      </ul>
    </section>
  );
};

export default DocumentListSideMenu;
