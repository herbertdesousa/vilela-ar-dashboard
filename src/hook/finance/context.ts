import { createContext } from 'react';

import { IFinanceContextData } from './types';

const FinanceContext = createContext<IFinanceContextData>(
  {} as IFinanceContextData,
);

export { FinanceContext };
