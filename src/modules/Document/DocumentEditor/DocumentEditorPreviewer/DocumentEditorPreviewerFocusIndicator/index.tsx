import React from 'react';

const DocumentEditorPreviewerFocusIndicator: React.FC = () => {
  return (
    <>
      <div
        className="w-2 h-2 absolute -top-1 -left-1"
        style={{
          border: '3px solid #A3CCF3',
          backgroundColor: '#FAFAFC',
        }}
      />
      <div
        className="w-2 h-2 absolute -top-1 -right-1"
        style={{
          border: '3px solid #A3CCF3',
          backgroundColor: '#FAFAFC',
        }}
      />
      <div
        className="w-2 h-2 absolute -bottom-1 -left-1"
        style={{
          border: '3px solid #A3CCF3',
          backgroundColor: '#FAFAFC',
        }}
      />
      <div
        className="w-2 h-2 absolute -bottom-1 -right-1"
        style={{
          border: '3px solid #A3CCF3',
          backgroundColor: '#FAFAFC',
        }}
      />
    </>
  );
};

export default DocumentEditorPreviewerFocusIndicator;
