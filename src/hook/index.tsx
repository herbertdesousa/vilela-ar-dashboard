import React from 'react';

import DocumentWrapper from './document/wrapper';
import { FinanceProvider } from './finance/provider';

const Hooks: React.FC = ({ children }) => {
  return (
    <FinanceProvider>
      <DocumentWrapper>{children}</DocumentWrapper>
    </FinanceProvider>
  );
};

export default Hooks;
