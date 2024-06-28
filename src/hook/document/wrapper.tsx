import { Formik } from 'formik';
import React from 'react';

import { v4 } from 'uuid';

import { DocumentProvider } from './provider';
import { IDocumentFormData } from './types/DocumentFormData';

export const DOCUMENT_BLOCK_INITIALS: IDocumentFormData = {
  id: v4(),
  type: 'orçamento',
  title: 'Sem Título',
  show_company_info: false,
  add_bank_details_page: false,
  show_signatures: false,
  layers: [
    {
      id: v4(),
      type: 'header',
      title: 'Cabeçalho',
      isLock: true,
      date: new Date(Date.now()),
      representative_engineer: '',
      representative_architect: '',
      order: -100000,
      customer: {
        name: '',
        document: '',
        representative: '',
      },
      address: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '',
      },
    },
    {
      id: v4(),
      type: 'block',
      title: 'Bloco I',
      order: 0,
      description: '',
      price: '',
      materials: [],
      places: [
        {
          id: v4(),
          room: 'Sala',
          floor: '',
          devices: [],
        },
      ],
    },
    {
      id: v4(),
      type: 'payment',
      title: 'Pagamento',
      isLock: true,
      order: 100000,
      comments: '',
    },
  ],
};

const DocumentWrapper: React.FC = ({ children }) => {
  return (
    <Formik
      initialValues={DOCUMENT_BLOCK_INITIALS}
      onSubmit={(data: IDocumentFormData) => console.log(data)}
    >
      <DocumentProvider>{children}</DocumentProvider>
    </Formik>
  );
};

export default DocumentWrapper;
