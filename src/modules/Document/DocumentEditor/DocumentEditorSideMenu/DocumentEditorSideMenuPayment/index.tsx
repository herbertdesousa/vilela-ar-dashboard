import React from 'react';
import { useRouter } from 'next/router';

import { Checkbox, TextField } from '@/components';
import { MdChevronLeft } from 'react-icons/md';
import { useDocument } from '@/hook/document';

const DocumentEditorSideMenuGeneral: React.FC = () => {
  const router = useRouter();
  const { layers } = useDocument();

  return (
    <section
      className="min-h-full py-16 px-10 overflow-x-scroll no-scroll"
      style={{ width: 512 }}
    >
      <div className="flex items-center mb-10">
        <button type="button" onClick={router.back}>
          <MdChevronLeft size={24} className="text-accent-6 mr-6" />
        </button>
        <h1 className="font-merriweather text-4xl font-bold">Pagamento</h1>
      </div>

      <div className="mt-10">
        <TextField
          name={`layers[${layers.value.length - 1}].comments`}
          label="OBS"
          type="textarea"
          containerClassName="mt-4"
        />
      </div>
    </section>
  );
};

export default DocumentEditorSideMenuGeneral;
