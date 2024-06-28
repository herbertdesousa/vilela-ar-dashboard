export interface IDocumentFormData {
  id: string;
  type: string;
  title: string;
  add_bank_details_page: boolean;
  show_company_info: boolean;
  show_signatures: boolean;
  layers: IDocumentFormDataLayers[];
}
export type IDocumentFormDataLayers =
  | IDocumentFormDataLayersHeader
  | IDocumentFormDataLayersBlock
  | IDocumentFormDataLayersPayment;

export type IDocumentFormDataLayersHeader = {
  id: string;
  type: 'header';
  title: string;
  isLock: boolean;
  order: number;

  date: Date;
  representative_engineer: string;
  representative_architect: string;
  customer: {
    name: string;
    document: string;
    representative: string;
  };
  address: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
};

export type IDocumentFormDataLayersBlock = {
  id: string;
  type: 'block';
  order: number;
  title: string;
  description: string;
  price: string;
  materials: string[];
  places: IDocumentFormDataLayersBlockPlace[];
};
export type IDocumentFormDataLayersBlockPlace = {
  id: string;
  floor: string;
  room: string;
  devices: IDocumentFormDataLayersBlockPlaceDevice[];
};
export type IDocumentFormDataLayersBlockPlaceDevice = {
  id: string;
  quantity: number;
  type: string;
  brand: string;
  capacity: string;
  mode: string;
};

export type IDocumentFormDataLayersPayment = {
  id: string;
  type: 'payment';
  title: string;
  isLock: boolean;
  order: number;

  comments: string;
};
