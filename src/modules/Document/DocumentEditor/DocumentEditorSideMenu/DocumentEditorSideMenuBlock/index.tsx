import React, { useCallback, useEffect, useRef } from 'react';
import { MdChevronLeft, MdClose, MdMoreVert } from 'react-icons/md';
import { useRouter } from 'next/router';

import { IDocumentFormDataLayersBlockPlace } from '@/hook/document/types/DocumentFormData';

import { useDocument } from '@/hook/document';
import {
  ClosableList,
  Dropdown,
  ListItem,
  Select,
  TextField,
} from '@/components';
import { IDropdownRef } from '@/components/Dropdown';
import moneyFormat from '@/utils/moneyFormat';
import romanFormat from '@/utils/romanFormat';
import { internalApi } from '@/services/api';

const DocumentEditorSideMenuBlock: React.FC = () => {
  const router = useRouter();

  const actionDropdownRef = useRef<IDropdownRef>(null);

  const { layers } = useDocument();
  const blockId = String(router.query.block_id);
  const blockIndex = layers.value.findIndex(i => i.id === blockId);

  const pushBlockPlacePage = (placeId: string) => {
    router.push({
      pathname: '/documents/editor/block/place',
      query: { block_id: blockId, block_place_id: placeId },
    });
  };

  const backToDocumentsPage = useCallback(() => {
    router.push('/documents/editor');
  }, [router]);

  const isRouteValid = layers.value[blockIndex];

  useEffect(() => {
    if (!isRouteValid) backToDocumentsPage();
  }, [isRouteValid]);

  if (!isRouteValid) {
    return <></>;
  }
  return (
    <section
      className="min-h-full py-16 px-10 overflow-x-scroll no-scroll"
      style={{ width: 512 }}
    >
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => router.push('/documents/editor')}
          >
            <MdChevronLeft size={24} className="text-accent-6 mr-6" />
          </button>
          <h1 className="font-merriweather text-4xl font-bold">
            {`Bloco ${romanFormat(blockIndex)}`}
          </h1>
        </div>

        <div className="relative flex justify-end">
          <button
            type="button"
            onClick={() => actionDropdownRef.current.toggle()}
          >
            <MdMoreVert size={24} className="text-accent-6" />
          </button>
          <Dropdown
            ref={actionDropdownRef}
            containerStyle={{ width: 150, right: 12, top: 12 }}
            data={[
              {
                item: 'Duplicar Bloco',
                value: 'duplicate',
                onSelect: () => {
                  layers.duplicate(blockIndex);
                  backToDocumentsPage();
                },
              },
              {
                item: <span className="text-red">Remover</span>,
                value: 'remove',
                onSelect: () => {
                  backToDocumentsPage();
                  layers.remove(blockIndex);
                },
              },
            ]}
          />
        </div>
      </div>

      <Select
        name={`layers[${blockIndex}].title`}
        label="Nome"
        isRequired
        placeholder="Nome do bloco"
        data={{
          variant: 'single',
          fetch: async () => {
            const response = await internalApi.get<{ name: string }[]>(
              'documents',
              { params: { type: 'block-name' } },
            );

            return response.data.map(i => ({ value: i.name }));
          },
          onAddFilter: async name => {
            await internalApi.post(
              `${internalApi}/documents`,
              { name },
              { params: { type: 'block-name' } },
            );
          },
        }}
      />
      <TextField
        name={`layers[${blockIndex}].description`}
        label="Descrição"
        type="textarea"
        placeholder="Descrição"
        containerClassName="mt-4"
      />
      <TextField
        name={`layers[${blockIndex}].price`}
        label="Valor (R$)"
        containerClassName="mt-4"
        isRequired
        formatOnChangeText={moneyFormat}
        placeholder="Valor para este bloco"
      />
      <ClosableList title="Materiais" containerClassName="mt-8">
        <Select
          name={`layers[${blockIndex}].materials`}
          label="Materiais"
          placeholder="Selecione os materiais"
          data={{
            variant: 'array',
            fetch: async () => {
              const response = await internalApi.get<{ name: string }[]>(
                'documents',
                { params: { type: 'materials' } },
              );

              return response.data.map(i => ({ value: i.name }));
            },
            onAddFilter: async name => {
              await internalApi.post(
                'documents',
                { name },
                { params: { type: 'materials' } },
              );
            },
          }}
        />
        <ul className="flex flex-wrap mt-2">
          {(layers.value[blockIndex] as any).materials.map(item => (
            <li key={item}>
              <button
                type="button"
                className="flex items-center px-2 py-1 bg-accent-2 rounded mr-2 h-8 mt-2"
                onClick={() => layers.materials.remove(blockId, item)}
              >
                <MdClose size={16} className="mr-2" />
                {item}
              </button>
            </li>
          ))}
        </ul>
      </ClosableList>
      <ClosableList
        title="Local Aparelho"
        containerClassName="mt-8"
        onAddBlock={() => layers.places.add(blockId)}
        list={{
          data: (layers.value[blockIndex] as any).places,
          renderItem: (item: IDocumentFormDataLayersBlockPlace, idx) => (
            <ListItem
              key={item.id}
              title={`${
                item.floor && item.room
                  ? `${item.floor} - ${item.room}`
                  : `${item.floor}${item.room}`
              }`}
              description={`${item.devices.length} Aparelhos`}
              onClick={() => pushBlockPlacePage(item.id)}
              rightComponent={{
                icon: MdMoreVert,
                dropdown: {
                  data: [
                    {
                      item: 'Duplicar Item',
                      value: 'duplicate',
                      onSelect: () => layers.places.duplicate(blockId, item),
                    },
                    {
                      item: <span className="text-red">Remover</span>,
                      value: 'remove',
                      onSelect: () => layers.places.remove(blockId, item.id),
                    },
                  ],
                },
              }}
              showBottomIndicator={
                (layers.value[blockIndex] as any).places.length - 1 !== idx
              }
              className={idx !== 0 && 'mt-2'}
            />
          ),
        }}
      />
    </section>
  );
};

export default DocumentEditorSideMenuBlock;
