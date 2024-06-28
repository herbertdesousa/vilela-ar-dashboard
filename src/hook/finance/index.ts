import { useContext } from 'react';

import { IFinanceContextData } from './types';
import { FinanceContext } from './context';

const useFinance = (): IFinanceContextData => {
  const context = useContext(FinanceContext);

  if (!context) {
    throw new Error('useFinance must be used within an FinanceContext');
  }

  return context;
};

export { useFinance };
