import React from 'react';

import { useDocument } from '@/hook/document';

const DocumentEditorPreviewerBankDetails: React.FC = () => {
  const { add_bank_details_page } = useDocument();

  if (!add_bank_details_page) return <></>;
  return (
    <div id="paper" className="bg-accent-0" style={{ height: 842, width: 595 }}>
      <div
        className="flex items-center p-12 rounded-t"
        style={{ backgroundColor: '#FAFAFC' }}
      >
        <img src="/logo.svg" alt="logo" className="w-12 h-12" />
        <h2 className="font-merriweather text-2xl font-bold ml-8">
          Dados Bancários
        </h2>
      </div>

      <div>
        <div className="mt-12 ml-12">
          <h3 className="text-base font-semibold">Bradesco</h3>

          <div className="mt-1 text-xs font-medium">
            <p>
              <span className="underline">Nome</span>
              :&nbsp;José Aparecido Vilela
            </p>
            <p>
              <span className="underline">CPF</span>
              :&nbsp;033.448.179-14
            </p>
            <p>
              <span className="underline">Agência</span>
              :&nbsp;1043
            </p>
            <p>
              <span className="underline">Conta</span>
              :&nbsp;Bradesco C.C. 0705106.9
            </p>
          </div>
        </div>
        <div className="mt-8 ml-12">
          <h3 className="text-base font-semibold">PIX</h3>

          <div className="mt-1 text-xs font-medium">
            <p>
              <span className="underline">Tipo</span>
              :&nbsp;CPF
            </p>
            <p>
              <span className="underline">Chave</span>
              :&nbsp;033.448.179-14
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditorPreviewerBankDetails;
