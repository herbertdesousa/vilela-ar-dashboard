import {
  IDocumentFormDataLayers,
  IDocumentFormDataLayersBlock,
  IDocumentFormDataLayersPayment,
  IDocumentFormDataLayersBlockPlace,
  IDocumentFormDataLayersBlockPlaceDevice,
  IDocumentFormData,
} from './types/DocumentFormData';

type IBlocksInPageItemVariants =
  | IDocumentFormDataLayersBlock
  | IDocumentFormDataLayersPayment;
export type IBlocksInPageItem = IBlocksInPageItemVariants & {
  height: number;
  width: number;
};

export interface IDocumentPayload {
  layers?: {
    onDeleteLayer(id: string): void;
  };
}

export interface IPreviewPages {
  label: string;
  isActive: boolean;
  order: number;
}

export interface IDocumentContextData {
  documents: IDocumentFormData[];
  saveDocument: () => void;
  clearEditor: () => Promise<void>;
  duplicateDocument: (id: string) => void;
  deleteDocument: (id: string) => void;
  startEditor: (data: IDocumentFormData) => void;
  pdf: {
    isGeneratingPDF: boolean;
    generate: () => void;
  };

  previewPages: {
    value: IPreviewPages[];
    activeIndex: number;
    activeName: string;
    changePage(pageName: string): void;
  };

  type: string;
  show_company_info: boolean;
  add_bank_details_page: boolean;
  show_signatures: boolean;
  title: string;

  layers: {
    blocksInPage: IBlocksInPageItem[][];
    saveBlockInPageMeasures: (payload: IBlocksInPageItem) => void;

    value: IDocumentFormDataLayers[];
    moveUp: (index: number) => void;
    moveDown: (index: number) => void;
    duplicate: (index: number) => void;
    remove: (index: number) => void;
    add: () => void;
    firstIndex: number;
    lastIndex: number;

    materials: {
      remove: (blockId: string, materialId: string) => void;
    };
    places: {
      duplicate: (
        blockId: string,
        item: IDocumentFormDataLayersBlockPlace,
      ) => void;
      remove: (blockId: string, placeId: string) => void;
      add: (blockId: string) => void;

      devices: {
        duplicate: (
          blockId: string,
          placeId: string,
          item: IDocumentFormDataLayersBlockPlaceDevice,
        ) => void;
        remove: (blockId: string, placeId: string, deviceId: string) => void;
        add: (blockId: string, placeId: string) => void;
      };
    };
  };
}
