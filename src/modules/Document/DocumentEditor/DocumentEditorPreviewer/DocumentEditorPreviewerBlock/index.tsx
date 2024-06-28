/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { useResizeDetector } from 'react-resize-detector';
import upFirstLetterFormat from '@/utils/upFirstLetterFormat';

import { useDocument } from '@/hook/document';

import {
  IDocumentFormDataLayersBlock,
  IDocumentFormDataLayersBlockPlaceDevice,
} from '@/hook/document/types/DocumentFormData';
import DocumentEditorPreviewerFocusIndicator from '../DocumentEditorPreviewerFocusIndicator';

interface IDocumentEditorPreviewerBlocksProps {
  block: IDocumentFormDataLayersBlock;
  blockIndex: number;
}

const DocumentEditorPreviewerBlocks: React.FC<
  IDocumentEditorPreviewerBlocksProps
> = ({ block, blockIndex }) => {
  const router = useRouter();
  const { layers } = useDocument();

  const blockId = String(router.query.block_id);
  const blockPlaceId = String(router.query.block_place_id);
  const blockPlaceDeviceId = String(router.query.block_place_device_id);

  const [isPlaceHover, setIsPlaceHover] = useState(false);
  const [isDeviceHover, setIsDeviceHover] = useState(false);

  const pushBlockPage = useCallback(
    (block_id: string) => {
      if (isPlaceHover || isDeviceHover) return;
      router.push({
        pathname: '/documents/editor/block',
        query: { block_id },
      });
    },
    [isDeviceHover, isPlaceHover, router],
  );
  const pushPlacePage = useCallback(
    (block_id: string, block_place_id: string) => {
      if (isDeviceHover) return;
      router.push({
        pathname: '/documents/editor/block/place',
        query: { block_id, block_place_id },
      });
    },
    [isDeviceHover, router],
  );
  const pushDevicePage = useCallback(
    (
      block_id: string,
      block_place_id: string,
      block_place_device_id: string,
    ) => {
      router.push({
        pathname: '/documents/editor/block/place/device',
        query: { block_id, block_place_id, block_place_device_id },
      });
    },
    [router],
  );

  const containerMeasuresRef = useResizeDetector();

  useEffect(() => {
    layers.saveBlockInPageMeasures({
      ...block,
      height: containerMeasuresRef.height,
      width: containerMeasuresRef.width,
    });
  }, [containerMeasuresRef.height, containerMeasuresRef.width]);

  const formatDeviceText = useCallback(
    (device: IDocumentFormDataLayersBlockPlaceDevice) => {
      return `
      ${Number(device.quantity) > 1 ? `${device.quantity}x ` : ''}
      ${device.type ? `${upFirstLetterFormat(device.type)} ` : ''}
      ${device.brand ? `${upFirstLetterFormat(device.brand)} ` : ''}
      ${device.mode ? `${upFirstLetterFormat(device.mode)} ` : ''}
      ${device.capacity}
    `;
    },
    [],
  );

  const activePage = useMemo((): string => {
    const splited = router.pathname.split('/');
    return splited[splited.length - 1];
  }, [router.pathname]);

  return (
    <div ref={containerMeasuresRef.ref}>
      <div
        role="button"
        tabIndex={0}
        className={`relative ${blockIndex !== 0 ? 'pt-4' : ''}`}
        onClick={() => pushBlockPage(block.id)}
        onKeyDown={() => pushBlockPage(block.id)}
        style={{
          outline:
            activePage === 'block' && block.id === blockId
              ? '3px solid #A3CCF3'
              : 0,
        }}
      >
        {activePage === 'block' && block.id === blockId && (
          <DocumentEditorPreviewerFocusIndicator />
        )}
        <div className="flex flex-col text-xs relative">
          <h3
            className="text-base font-semibold"
            style={{ lineHeight: '1rem' }}
          >
            {block.title}
          </h3>
          {!!block.places.length && (
            <div className="flex mt-3">
              <strong>Aparelhos:</strong>
              <ul>
                <div className="mb-1">
                  {block.places.map((place, placeIndex) => (
                    <li
                      role="button"
                      key={place.id}
                      className="flex relative z-10 text-xs ml-1"
                      style={{
                        outline:
                          activePage === 'place' &&
                          block.id === blockId &&
                          place.id === blockPlaceId
                            ? '3px solid #A3CCF3'
                            : 0,
                      }}
                      onMouseEnter={() => setIsPlaceHover(true)}
                      onMouseLeave={() => setIsPlaceHover(false)}
                      onClick={() => pushPlacePage(block.id, place.id)}
                      onKeyDown={() => pushPlacePage(block.id, place.id)}
                    >
                      {activePage === 'place' &&
                        block.id === blockId &&
                        place.id === blockPlaceId && (
                          <DocumentEditorPreviewerFocusIndicator />
                        )}
                      <span
                        className={`font-medium mr-1 underline whitespace-nowrap ${
                          placeIndex !== 0 ? 'mt-1' : ''
                        }`}
                      >
                        {place.floor && `(${place.floor})`}
                        {place.room ? ` ${place.room}: ` : ':'}
                      </span>
                      <ul className={placeIndex !== 0 ? 'mt-1' : ''}>
                        {place.devices.map(device => (
                          <li
                            role="button"
                            key={device.id}
                            className="relative"
                            style={{
                              outline:
                                activePage === 'device' &&
                                block.id === blockId &&
                                place.id === blockPlaceId &&
                                device.id === blockPlaceDeviceId
                                  ? '3px solid #A3CCF3'
                                  : 0,
                            }}
                            onMouseEnter={() => setIsDeviceHover(true)}
                            onMouseLeave={() => setIsDeviceHover(false)}
                            onClick={() => {
                              pushDevicePage(block.id, place.id, device.id);
                            }}
                            onKeyDown={() => {
                              pushDevicePage(block.id, place.id, device.id);
                            }}
                          >
                            {activePage === 'device' &&
                              block.id === blockId &&
                              place.id === blockPlaceId &&
                              device.id === blockPlaceDeviceId && (
                                <DocumentEditorPreviewerFocusIndicator />
                              )}
                            {formatDeviceText(device)}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </div>
              </ul>
            </div>
          )}

          {!!block.materials.length && (
            <div className="flex text-xs">
              <strong className="mr-1 mt-3">Mateirias:</strong>
              <p className="mt-3">
                {block.materials.map((material, index) => (
                  <span key={material}>
                    {/* eslint-disable-next-line prettier/prettier */}
                    {`${material}${block.materials.length - 1 !== index ? ', ': ''}`}
                  </span>
                ))}
              </p>
            </div>
          )}
          {!!block.description && (
            <div className="flex text-xs">
              <strong className="mr-1 mt-3">Descrição:</strong>
              <p className="mt-3 whitespace-pre-line">{block.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentEditorPreviewerBlocks;
