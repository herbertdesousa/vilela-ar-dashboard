import React from 'react';
import { useRouter } from 'next/router';

import {
  Checkbox,
  ClosableList,
  ListItem,
  Select,
  Switch,
  TextField,
} from '@/components';
import { MdLock, MdMoreVert } from 'react-icons/md';
import { useDocument } from '@/hook/document';

import { IDocumentFormDataLayers } from '@/hook/document/types/DocumentFormData';
import { internalApi } from '@/services/api';

const DocumentEditorSideMenuGeneral: React.FC = () => {
  const { push } = useRouter();
  const { layers } = useDocument();

  const onClickLayer = (item: IDocumentFormDataLayers) => {
    if (item.type === 'header') push('/documents/editor/header');
    if (item.type === 'block')
      push({
        pathname: '/documents/editor/block',
        query: { block_id: item.id },
      });
    if (item.type === 'payment') push('/documents/editor/payment');
  };

  return (
    <section
      className="min-h-full py-16 px-10 overflow-x-scroll no-scroll"
      style={{ width: 512 }}
    >
      <h1 className="font-merriweather text-4xl font-bold">Documento</h1>

      <div className="mt-10">
        <Select
          name="type"
          label="Tipo"
          isRequired
          data={{
            variant: 'single',
            fetch: async () => {
              const response = await internalApi.get<{ name: string }[]>(
                'documents',
                { params: { type: 'title' } },
              );

              return response.data.map(i => ({ value: i.name }));
            },
            onAddFilter: async name => {
              await internalApi.post(
                'documents',
                { name },
                { params: { type: 'title' } },
              );
            },
          }}
        />
        <TextField
          name="title"
          label="Nome do Documento"
          isRequired
          containerClassName="mt-4"
        />
        <Checkbox
          name="add_bank_details_page"
          label="Adicionar Página de Dados Bancários"
          containerClassName="mt-4"
        />
        <Checkbox
          name="show_company_info"
          label="Mostrar Dados da empresa"
          containerClassName="mt-4"
        />
        <Checkbox
          name="show_signatures"
          label="Mostrar Local para Assinar"
          containerClassName="mt-4"
        />
        <ClosableList
          title="Camadas"
          containerClassName="mt-8"
          onAddBlock={() => layers.add()}
          list={{
            data: layers.value.sort((a: any, b: any) => a.order - b.order),
            renderItem: (item: IDocumentFormDataLayers, index) => (
              <ListItem
                key={item.id}
                title={(() => (
                  <div className="flex items-center">
                    {(item as any)?.isLock && (
                      <MdLock size={20} className="text-accent-4 mr-2" />
                    )}
                    {item.title}
                  </div>
                ))()}
                onClick={() => onClickLayer(item)}
                rightComponent={
                  !(item as any)?.isLock && {
                    icon: MdMoreVert,
                    dropdown: {
                      data: [
                        {
                          item: (
                            <span
                              className={
                                index === layers.firstIndex
                                  ? 'text-accent-3'
                                  : 'text-accent-6'
                              }
                            >
                              Mover para Cima
                            </span>
                          ),
                          value: 'move_up',
                          disabled: index === layers.firstIndex,
                          onSelect: () => layers.moveUp(index),
                        },
                        {
                          item: (
                            <span
                              className={
                                layers.lastIndex === index
                                  ? 'text-accent-3'
                                  : 'text-accent-6'
                              }
                            >
                              Mover para Baixo
                            </span>
                          ),
                          value: 'move_down',
                          disabled: layers.lastIndex === index,
                          onSelect: () => layers.moveDown(index),
                        },
                        {
                          item: 'Duplicar Bloco',
                          value: 'duplicate',
                          onSelect: () => layers.duplicate(index),
                        },
                        {
                          item: <span className="text-red">Remover</span>,
                          value: 'remove',
                          onSelect: () => layers.remove(index),
                        },
                      ],
                    },
                  }
                }
                showBottomIndicator={layers.value.length - 1 !== index}
                className="mt-2"
              />
            ),
          }}
        />
      </div>
    </section>
  );
};

export default DocumentEditorSideMenuGeneral;
