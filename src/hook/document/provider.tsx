/* eslint-disable no-await-in-loop */
/* eslint-disable no-new */
import React, { useCallback, useEffect, useState } from 'react';
import { useField, useFormikContext } from 'formik';

import html2canvas from 'html2canvas';
import { jsPDF as JsPDF } from 'jspdf';

import { v4 } from 'uuid';

import upFirstLetterFormat from '@/utils/upFirstLetterFormat';

import { useRouter } from 'next/router';
import { DocumentContext } from './context';
import {
  IDocumentFormData,
  IDocumentFormDataLayers,
  IDocumentFormDataLayersHeader,
  IDocumentFormDataLayersBlock,
  IDocumentFormDataLayersBlockPlace,
  IDocumentFormDataLayersBlockPlaceDevice,
} from './types/DocumentFormData';
import { DOCUMENT_BLOCK_INITIALS } from './wrapper';
import { IBlocksInPageItem, IPreviewPages } from './types';

const DOCUMENTS_STORAGE_KEY = '@documents';

const PREVIEW_PAGES_DEFAULT = [
  {
    label: 'Página 1',
    isActive: true,
    order: 1,
  },
];

const order = (
  arr: IBlocksInPageItem[],
  { firstLimit, restLimit }: { firstLimit: number; restLimit: number },
): IBlocksInPageItem[][] => {
  const result: IBlocksInPageItem[][] = [];
  const currentIndex = { current: 0 };

  arr.map((item, index): any => {
    if (index === 0) {
      result.push([item]);
      return undefined;
    }

    const sum = result[currentIndex.current]
      .map(i => i.height)
      .reduce((a, b) => a + b);

    const limit = currentIndex.current === 0 ? firstLimit : restLimit;
    if (item.height + sum < limit + 1) {
      result[currentIndex.current].push(item);
    } else {
      currentIndex.current += 1;
      result.push([item]);
    }
    return undefined;
  });

  return result;
};

function delay(delayInms: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
}

export const DocumentProvider: React.FC = ({ children }) => {
  const {
    values: documentData,
    setFieldValue,
    resetForm,
    setValues,
  } = useFormikContext<IDocumentFormData>();
  const router = useRouter();

  const [documents, setDocuments] = useState<IDocumentFormData[]>(() => {
    if (!process.browser) return [];

    return (
      (JSON.parse(
        localStorage.getItem(DOCUMENTS_STORAGE_KEY),
      ) as IDocumentFormData[]) || []
    );
  });

  useEffect(() => {
    const customerName = (
      documentData.layers[0] as IDocumentFormDataLayersHeader
    ).customer.name;

    setFieldValue(
      'title',
      customerName
        ? `${upFirstLetterFormat(documentData.type)} - ${customerName}`
        : 'Sem Título',
    );
  }, [documentData.layers[0], documentData.type, setFieldValue]);

  const layersMoveUp = useCallback(
    (index: number) => {
      const item = documentData.layers[index];
      if (item.type === 'header' || item.type === 'payment') return;

      setFieldValue(
        'layers',
        documentData.layers.map((i, idx: number) => {
          if (i.id === item.id) return { ...i, order: i.order - 1 };
          if (index - 1 === idx) return { ...i, order: i.order + 1 };
          return i;
        }),
      );
    },
    [documentData.layers, setFieldValue],
  );
  const layersMoveDown = useCallback(
    (index: number) => {
      const item = documentData.layers[index];
      if (item.type === 'header' || item.type === 'payment') return;

      setFieldValue(
        'layers',
        documentData.layers.map((i, idx: number) => {
          if (i.id === item.id) return { ...i, order: i.order + 1 };
          if (index + 1 === idx) return { ...i, order: i.order - 1 };
          return i;
        }),
      );
    },
    [documentData.layers, setFieldValue],
  );
  const layersDuplicate = useCallback(
    (index: number) => {
      const item = documentData.layers[index];
      const higherOrder = Math.max(
        ...documentData.layers
          .filter(i => i.type !== 'header' && i.type !== 'payment')
          .map((i: any) => i.order),
      );

      const updatedItem = {
        ...documentData.layers.find(layer => layer.id === item.id),
        id: v4(),
        title: `${item.title} (Cópia)`,
        order: higherOrder + 1,
      } as IDocumentFormDataLayersBlock;
      setFieldValue('layers', [...documentData.layers, updatedItem]);
    },
    [documentData.layers, setFieldValue],
  );
  const layersRemove = useCallback(
    (index: number) => {
      const item = documentData.layers[index];
      setFieldValue(
        'layers',
        documentData.layers
          .filter(i => i.id !== item.id)
          .map((i, idx) => {
            if (i.type === 'header' || i.type === 'payment') return i;
            return { ...i, order: idx - 1 };
          }),
      );

      removeBlockInPageMeasures(item.id);
    },
    [documentData.layers, setFieldValue],
  );
  const layersAdd = useCallback(() => {
    const higherOrder = Math.max(
      ...documentData.layers
        .filter(i => i.type !== 'header' && i.type !== 'payment')
        .map(i => i.order),
      0,
    );

    const item = {
      ...DOCUMENT_BLOCK_INITIALS.layers[1],
      id: v4(),
      order: higherOrder + 1,
      type: 'block',
      title: 'Bloco',
    } as IDocumentFormDataLayersBlock;
    setFieldValue('layers', [...documentData.layers, item]);
  }, [documentData.layers, setFieldValue]);

  const materialsRemove = useCallback(
    (blockId: string, materialId: string) => {
      setFieldValue(
        'layers',
        documentData.layers.map((block: IDocumentFormDataLayersBlock) => {
          if (block.id !== blockId) return block;
          return {
            ...block,
            materials: block.materials.filter(i => i !== materialId),
          };
        }),
      );
    },
    [documentData.layers, setFieldValue],
  );

  const placeDuplicate = useCallback(
    (blockId: string, item: IDocumentFormDataLayersBlockPlace) => {
      const duplicateItem = { ...item, id: v4() };
      setFieldValue(
        'layers',
        documentData.layers.map((block: IDocumentFormDataLayersBlock) => {
          if (block.id !== blockId) return block;
          return {
            ...block,
            places: [...block.places, duplicateItem],
          };
        }),
      );
      document.dispatchEvent(
        new CustomEvent('@block-place:duplicate', {
          detail: { item: duplicateItem },
        }),
      );
    },
    [documentData.layers, setFieldValue],
  );
  const placeRemove = useCallback(
    (blockId: string, placeId: string) => {
      setFieldValue(
        'layers',
        documentData.layers.map((block: IDocumentFormDataLayersBlock) => {
          if (block.id !== blockId) return block;
          return {
            ...block,
            places: [...block.places.filter(i => i.id !== placeId)],
          };
        }),
      );
      document.dispatchEvent(
        new CustomEvent('@block-place:remove', {
          detail: { blockId, id: placeId },
        }),
      );
    },
    [documentData.layers, setFieldValue],
  );
  const placeAdd = useCallback(
    (blockId: string) => {
      const item = { id: v4(), devices: [], room: 'Sala', floor: '' };

      setFieldValue(
        'layers',
        documentData.layers.map((block: IDocumentFormDataLayersBlock) => {
          if (block.id !== blockId) return block;
          return {
            ...block,
            places: [...block.places, item],
          };
        }),
      );
      document.dispatchEvent(
        new CustomEvent('@block-place:add', {
          detail: { item },
        }),
      );
    },
    [documentData.layers, setFieldValue],
  );

  const placeDeviceDuplicate = useCallback(
    (
      blockId: string,
      placeId: string,
      item: IDocumentFormDataLayersBlockPlaceDevice,
    ) => {
      setFieldValue(
        'layers',
        documentData.layers.map((block: IDocumentFormDataLayersBlock) => {
          if (block.id !== blockId) return block;
          return {
            ...block,
            places: block.places.map(place => {
              if (place.id !== placeId) return place;
              return {
                ...place,
                devices: [...place.devices, { ...item, id: v4() }],
              };
            }),
          };
        }),
      );
    },
    [documentData.layers, setFieldValue],
  );
  const placeDeviceRemove = useCallback(
    (blockId: string, placeId: string, deviceId: string) => {
      setFieldValue(
        'layers',
        documentData.layers.map((block: IDocumentFormDataLayersBlock) => {
          if (block.id !== blockId) return block;
          return {
            ...block,
            places: block.places.map(place => {
              if (place.id !== placeId) return place;
              return {
                ...place,
                devices: place.devices.filter(i => i.id !== deviceId),
              };
            }),
          };
        }),
      );
    },
    [documentData.layers, setFieldValue],
  );
  const placeDeviceAdd = useCallback(
    (blockId: string, placeId: string) => {
      setFieldValue(
        'layers',
        documentData.layers.map((block: IDocumentFormDataLayersBlock) => {
          if (block.id !== blockId) return block;
          return {
            ...block,
            places: block.places.map(place => {
              if (place.id !== placeId) return place;
              return {
                ...place,
                devices: [
                  ...place.devices,
                  {
                    id: v4(),
                    brand: '',
                    capacity: '',
                    mode: '',
                    quantity: 1,
                    type: 'Ar Condicionado',
                  },
                ],
              };
            }),
          };
        }),
      );
    },
    [documentData.layers, setFieldValue],
  );

  const blockInPageDefault = useCallback(
    (layers: IDocumentFormDataLayers[]): IBlocksInPageItem[][] => [
      [
        ...(
          layers.filter(
            item => item.type === 'block',
          ) as IDocumentFormDataLayersBlock[]
        ).map(item => ({
          height: 0,
          width: 0,
          ...item,
        })),
        {
          height: 0,
          width: 0,
          ...(layers.filter(
            item => item.type === 'payment',
          )[0] as IDocumentFormDataLayersBlock),
        },
      ],
    ],
    [],
  );
  const [blocksInPage, setBlocksInPage] = useState<IBlocksInPageItem[][]>(
    blockInPageDefault(documentData.layers),
  );

  useEffect(() => {
    documentData.layers.map(i => {
      if (i.type === 'block')
        saveBlockInPageMeasures({ ...i, width: 0, height: 0 });

      return i;
    }, []);
  }, [documentData.layers]);

  const [previewPages, setPreviewPages] = useState<IPreviewPages[]>(
    PREVIEW_PAGES_DEFAULT,
  );
  const changePage = useCallback(pageName => {
    setPreviewPages(st =>
      st.map(page => ({
        ...page,
        isActive: page.label === pageName,
      })),
    );
  }, []);

  useEffect(() => {
    if (documentData.add_bank_details_page) {
      setPreviewPages(st => [
        ...st,
        { label: 'Dados Bancários', isActive: false, order: 100000 },
      ]);
    } else {
      setPreviewPages(st =>
        st
          .filter(i => i.label !== 'Dados Bancários')
          .map((y, idx) => ({
            ...y,
            isActive: idx === 0,
          })),
      );
    }
  }, [documentData.add_bank_details_page]);

  const saveBlockInPageMeasures = useCallback((payload: IBlocksInPageItem) => {
    const savePreviewPages = (updatedBlocks: IBlocksInPageItem[][]) => {
      setPreviewPages(pages => {
        // if (pages.find(i => i.isActive).label === 'Dados Bancários')
        //   return pages;
        if (pages.findIndex(i => i.isActive) + 1 > updatedBlocks.length) {
          return pages.map((y, idx) => ({
            ...y,
            isActive: idx === 0,
          }));
        }
        return [
          ...Array(updatedBlocks.length)
            .fill('')
            .map((y, idx) => ({
              label: `Página ${idx + 1}`,
              isActive:
                pages.find(i => i.label === `Página ${idx + 1}`)?.isActive ||
                false,
              order: idx,
            })),
          pages.find(i => i.label === 'Dados Bancários'),
        ].filter(i => typeof i !== 'undefined');
      });
    };

    setBlocksInPage(st => {
      const pageLimit = { firstLimit: 400, restLimit: 600 };
      if (st.find(page => page.find(block => block.id === payload.id))) {
        const updated = st.map(page =>
          page.map(block =>
            block.id === payload.id
              ? {
                  ...payload,
                  height: payload.height || block.height,
                  width: payload.width || block.width,
                }
              : block,
          ),
        );

        const updatedBlocks = order(
          updated.flat().sort((a: any, b: any) => a.order - b.order),
          pageLimit,
        );

        savePreviewPages(updatedBlocks);

        return updatedBlocks;
      }

      const updatedBlocks = order(
        [
          ...st.flat().map(i => ({ ...i, height: i.height || 48 })),
          { ...payload, height: payload.height || 48 },
        ].sort((a: any, b: any) => a.order - b.order),
        pageLimit,
      );

      savePreviewPages(updatedBlocks);

      return updatedBlocks;
    });
  }, []);

  const removeBlockInPageMeasures = useCallback((id: string) => {
    setBlocksInPage(st => {
      return st.map(page => page.filter(block => block.id !== id));
    });
  }, []);

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const generatePDF = useCallback(async () => {
    router.push('/documents/editor');
    await delay(1);

    setIsGeneratingPDF(true);

    const pdf = new JsPDF('p', 'px', '', true);
    const currentPdfPage = { page: pdf };

    // eslint-disable-next-line no-plusplus
    for (let pageIndex = 0; pageIndex < previewPages.length; pageIndex++) {
      setPreviewPages(pages =>
        pages.map((p, idx) => ({ ...p, isActive: idx === pageIndex })),
      );

      await delay(10);

      const takePicAndSave = async () => {
        await html2canvas(document.getElementById('page')).then(canvas => {
          const imgData = canvas.toDataURL('image/png');

          const imgProps = currentPdfPage.page.getImageProperties(imgData);
          const pdfWidth = currentPdfPage.page.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          currentPdfPage.page.addImage(
            imgData,
            'JPEG',
            0,
            0,
            pdfWidth,
            pdfHeight,
            '',
            'FAST',
          );
        });

        if (pageIndex !== previewPages.length - 1)
          currentPdfPage.page = pdf.addPage('', 'p');
      };
      await takePicAndSave();
    }

    pdf.save(documentData.title);
    await delay(1);
    setIsGeneratingPDF(false);
  }, [documentData.title, previewPages.length]);

  const saveDocument = useCallback(() => {
    const updatedDocs = documents.find(doc => doc.id === documentData.id)
      ? documents.map(doc => (doc.id === documentData.id ? documentData : doc))
      : [documentData, ...documents];

    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(updatedDocs));
    setDocuments(updatedDocs);
  }, [documents, documentData]);

  const duplicateDocument = useCallback(
    (id: string) => {
      const updatedDocs = (() => {
        const finded = documents.find(doc => doc.id === id);
        return [
          {
            ...finded,
            id: v4(),
          },
          ...documents,
        ];
      })();

      localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(updatedDocs));
      setDocuments(updatedDocs);
    },
    [documents],
  );

  const deleteDocument = useCallback(
    (id: string) => {
      const updatedDocs = documents.filter(doc => doc.id !== id);

      localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(updatedDocs));
      setDocuments(updatedDocs);
    },
    [documents],
  );

  const clearEditor = useCallback(async () => {
    setPreviewPages(PREVIEW_PAGES_DEFAULT);
    setBlocksInPage(blockInPageDefault(documentData.layers));
    resetForm();
  }, [blockInPageDefault, documentData.layers, resetForm]);

  const startEditor = useCallback(
    (data: IDocumentFormData) => {
      setValues(data);
      setPreviewPages(PREVIEW_PAGES_DEFAULT);
      setBlocksInPage(blockInPageDefault(data.layers));
    },
    [blockInPageDefault, setValues],
  );

  return (
    <DocumentContext.Provider
      value={{
        saveDocument,
        deleteDocument,
        clearEditor,
        duplicateDocument,
        startEditor,
        show_company_info: documentData.show_company_info,
        show_signatures: documentData.show_signatures,
        documents,
        pdf: {
          isGeneratingPDF,
          generate: generatePDF,
        },
        previewPages: {
          value: previewPages,
          activeIndex: previewPages.findIndex(i => i.isActive),
          activeName: previewPages.find(i => i.isActive).label,
          changePage,
        },
        type: documentData.type,
        add_bank_details_page: Boolean(documentData.add_bank_details_page),
        title: documentData.title,
        layers: {
          saveBlockInPageMeasures,
          blocksInPage,
          value: documentData.layers,
          moveUp: layersMoveUp,
          moveDown: layersMoveDown,
          duplicate: layersDuplicate,
          remove: layersRemove,
          add: layersAdd,
          firstIndex: 1,
          lastIndex: documentData.layers.length - 2,

          materials: {
            remove: materialsRemove,
          },
          places: {
            duplicate: placeDuplicate,
            remove: placeRemove,
            add: placeAdd,

            devices: {
              duplicate: placeDeviceDuplicate,
              remove: placeDeviceRemove,
              add: placeDeviceAdd,
            },
          },
        },
      }}
    >
      {isGeneratingPDF && (
        <section className="absolute flex items-center justify-center w-full h-full bg-accent-6 z-50 opacity-95">
          <p className="text-accent-0 text-4xl">Gerando o PDF...</p>
        </section>
      )}
      {children}
    </DocumentContext.Provider>
  );
};
