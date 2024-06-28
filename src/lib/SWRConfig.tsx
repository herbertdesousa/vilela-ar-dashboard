import React from 'react';

import { SWRConfig } from 'swr';
import { fetch } from '@/services/fetch';

const SWRConfigComponent: React.FC = ({ children }) => {
  return (
    <SWRConfig
      value={{
        fetcher: fetch,
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRConfigComponent;
