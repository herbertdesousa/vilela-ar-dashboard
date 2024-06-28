import { useContext } from 'react';

import { IDocumentContextData } from './types';
import { DocumentContext } from './context';

const useDocument = (): IDocumentContextData => {
  const context = useContext(DocumentContext);

  if (!context) {
    throw new Error('useDocument must be used within an DocumentContext');
  }

  return context;
};

export { useDocument };
