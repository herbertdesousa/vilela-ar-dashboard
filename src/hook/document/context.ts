import { createContext } from 'react';

import { IDocumentContextData } from './types';

const DocumentContext = createContext<IDocumentContextData>(
  {} as IDocumentContextData,
);

export { DocumentContext };
