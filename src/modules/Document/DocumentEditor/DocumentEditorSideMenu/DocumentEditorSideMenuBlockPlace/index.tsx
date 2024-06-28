import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import { MdChevronLeft, MdDelete, MdMoreVert } from 'react-icons/md';
import romanFormat from '@/utils/romanFormat';
import { BreadCrumb, ClosableList, ListItem, Select } from '@/components';
import { useDocument } from '@/hook/document';

import { IDocumentFormDataLayersBlockPlaceDevice } from '@/hook/document/types/DocumentFormData';
import upFirstLetterFormat from '@/utils/upFirstLetterFormat';
import { internalApi } from '@/services/api';

const DocumentEditorSideMenuBlockPlace: React.FC = () => {
  const router = useRouter();

  const { layers } = useDocument();
  const blockId = String(router.query.block_id);
  const blockIndex = layers.value.findIndex(i => i.id === blockId);

  const blockPlaceId = String(router.query.block_place_id);
  const blockPlaceIndex = (layers.value[blockIndex] as any)?.places.findIndex(
    i => i.id === blockPlaceId,
  );

  const pushBlockPlaceDevicePage = (deviceId: string) => {
    router.push({
      pathname: '/documents/editor/block/place/device',
      query: {
        block_id: blockId,
        block_place_id: blockPlaceId,
        block_place_device_id: deviceId,
      },
    });
  };

  const backToBlock = () => {
    router.push({
      pathname: '/documents/editor/block',
      query: { block_id: blockId },
    });
  };

  const onDeleteItem = () => {
    layers.places.remove(blockId, blockPlaceId);
    backToBlock();
  };

  const isRouteValid =
    layers.value[blockIndex] || (layers.value[blockPlaceIndex] as any)?.places;

  useEffect(() => {
    if (!isRouteValid) router.push('/documents/editor');
  }, [isRouteValid, router]);

  if (!isRouteValid) {
    return <></>;
  }
  return (
    <section
      className="min-h-full overflow-x-scroll no-scroll"
      style={{ width: 512 }}
    >
      <div className="flex items-center justify-between px-10 py-6 border-b border-accent-2">
        <button type="button" onClick={backToBlock}>
          <MdChevronLeft size={24} className="text-accent-6" />
        </button>

        <h1 className="font-merriweather text-lg font-bold">
          {`Local ${romanFormat(Number(blockPlaceIndex) + 1)}`}
        </h1>

        <button
          type="button"
          className="flex items-center text-accent-6 font-medium"
          onClick={onDeleteItem}
        >
          <MdDelete size={20} className="mr-1 text-red" />
          Deletar
        </button>
      </div>

      <div className="px-10">
        <BreadCrumb
          data={[
            {
              label: `Bloco ${romanFormat(blockIndex)}`,
              onClick: backToBlock,
            },
            {
              label: `Local ${romanFormat(Number(blockPlaceIndex) + 1)}`,
              active: true,
            },
          ]}
          className="mt-8"
        />

        <Select
          name={`layers[${blockIndex}].places[${blockPlaceIndex}].room`}
          label="Nome do Local"
          placeholder="Selecione o nome da sala"
          className="mt-8"
          showClearField
          data={{
            variant: 'single',
            fetch: async () => {
              const response = await internalApi.get<{ name: string }[]>(
                'documents',
                { params: { type: 'place-room' } },
              );

              return response.data.map(i => ({ value: i.name }));
            },
            onAddFilter: async name => {
              await internalApi.post(
                'documents',
                { name },
                { params: { type: 'place-room' } },
              );
            },
          }}
        />
        <Select
          name={`layers[${blockIndex}].places[${blockPlaceIndex}].floor`}
          label="Nome do Piso"
          placeholder="Selecione o piso"
          className="mt-8"
          showClearField
          data={{
            variant: 'single',
            fetch: async () => {
              const response = await internalApi.get<{ name: string }[]>(
                'documents',
                { params: { type: 'place-floor' } },
              );

              return response.data.map(i => ({ value: i.name }));
            },
            onAddFilter: async name => {
              await internalApi.post(
                'documents',
                { name },
                { params: { type: 'place-floor' } },
              );
            },
          }}
        />
        <ClosableList
          title="Aparelhos"
          containerClassName="mt-8"
          onAddBlock={() => layers.places.devices.add(blockId, blockPlaceId)}
          list={{
            data:
              (layers.value[blockIndex] as any).places[blockPlaceIndex]
                ?.devices || [],
            renderItem: (
              item: IDocumentFormDataLayersBlockPlaceDevice,
              idx,
            ) => (
              <ListItem
                key={item.id}
                // eslint-disable-next-line prettier/prettier
                title={`${upFirstLetterFormat(item.type)} ${item.brand} ${item.mode} ${item.capacity}`}
                onClick={() => pushBlockPlaceDevicePage(item.id)}
                rightComponent={{
                  icon: MdMoreVert,
                  dropdown: {
                    data: [
                      {
                        item: 'Duplicar Item',
                        value: 'duplicate',
                        onSelect: () =>
                          layers.places.devices.duplicate(
                            blockId,
                            blockPlaceId,
                            item,
                          ),
                      },
                      {
                        item: <span className="text-red">Remover</span>,
                        value: 'remove',
                        onSelect: () =>
                          layers.places.devices.remove(
                            blockId,
                            blockPlaceId,
                            item.id,
                          ),
                      },
                    ],
                  },
                }}
                showBottomIndicator={
                  (layers.value[blockIndex] as any).places[blockPlaceIndex]
                    .devices.length -
                    1 !==
                  idx
                }
                className={idx !== 0 && 'mt-2'}
              />
            ),
          }}
        />
      </div>
    </section>
  );
};

export default DocumentEditorSideMenuBlockPlace;
