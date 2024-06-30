import React from 'react';

import DocumentWrapper from './document/wrapper';

const Hooks: React.FC = ({ children }) => {
  return <DocumentWrapper>{children}</DocumentWrapper>;
};

export default Hooks;
