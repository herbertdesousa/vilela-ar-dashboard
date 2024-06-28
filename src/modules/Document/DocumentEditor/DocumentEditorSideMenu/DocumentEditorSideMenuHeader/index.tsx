import React, { useState } from 'react';
import { MdChevronLeft } from 'react-icons/md';
import { useRouter } from 'next/router';

import { Select, TextField, DatePicker, ClosableList } from '@/components';
import documentFormatter from '@/utils/documentFormatter';
import postalCodeFormatter from '@/utils/postalCodeFormatter';
import { api } from '@/services/api';
import { useFormikContext } from 'formik';

import { IDocumentFormData } from '@/hook/document/types/DocumentFormData';

interface IViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

const DocumentEditorSideMenuHeader: React.FC = () => {
  const router = useRouter();
  const { setValues, values } = useFormikContext<IDocumentFormData>();

  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const fetchAddress = async (postalCode: string) => {
    try {
      setIsFetchingAddress(true);

      const response = await api.get<IViaCEPResponse>(
        `https://viacep.com.br/ws/${postalCode}/json/`,
      );

      setValues({
        ...values,
        layers: values.layers.map(block => {
          if (block.type !== 'header') return block;
          return {
            ...block,
            address: {
              ...block.address,
              postalCode: response.data.cep,
              street: response.data.logradouro,
              complement: response.data.complemento,
              neighborhood: response.data.bairro,
              city: response.data.localidade,
              state: response.data.uf,
            },
          };
        }),
      });

      setIsFetchingAddress(false);
      // eslint-disable-next-line no-empty
    } catch (err) {}
  };

  return (
    <section
      className="min-h-full py-16 px-10 overflow-x-scroll no-scroll"
      style={{ width: 512 }}
    >
      <div className="flex items-center mb-10">
        <button type="button" onClick={router.back}>
          <MdChevronLeft size={24} className="text-accent-6 mr-6" />
        </button>
        <h1 className="font-merriweather text-4xl font-bold">Cabeçalho</h1>
      </div>

      <DatePicker name="layers[0].date" label="Data" isRequired />
      <TextField
        name="layers[0].representative_engineer"
        label="Engenheiro"
        containerClassName="w-full mt-4"
        placeholder="Nome do engenheiro"
      />
      <TextField
        name="layers[0].representative_architect"
        label="Arquiteto"
        containerClassName="w-full mt-4"
        placeholder="Nome do arquiteto"
      />
      <ClosableList title="Cliente" containerClassName="mt-8">
        <TextField
          name="layers[0].customer.name"
          label="Nome"
          isRequired
          placeholder="Nome o cliente"
        />
        <TextField
          name="layers[0].customer.document"
          label="CPF / CNPJ"
          containerClassName="mt-4"
          formatOnChangeText={documentFormatter}
          placeholder="Documento"
        />
        <TextField
          name="layers[0].customer.representative"
          label="Representante"
          placeholder="Nome do representante"
          containerClassName="mt-4"
        />
      </ClosableList>
      <ClosableList title="Endereço" containerClassName="mt-8">
        <TextField
          name="layers[0].address.postalCode"
          label="CEP"
          disabled={isFetchingAddress}
          formatOnChangeText={text => {
            const onlyDigis = text.replace(/\D/, '');
            if (onlyDigis.length === 8) fetchAddress(onlyDigis);
            return postalCodeFormatter(text);
          }}
          placeholder="CEP"
          containerClassName="mt-4"
        />
        <TextField
          name="layers[0].address.street"
          label="Rua/Avenida"
          placeholder="Rua/Avenida"
          containerClassName="mt-4"
          disabled={isFetchingAddress}
        />
        <TextField
          name="layers[0].address.number"
          label="Numero"
          placeholder="Numero"
          containerClassName="mt-4"
          disabled={isFetchingAddress}
        />
        <TextField
          name="layers[0].address.complement"
          label="Complemento"
          placeholder="Complemento"
          containerClassName="mt-4"
          disabled={isFetchingAddress}
        />
        <TextField
          name="layers[0].address.neighborhood"
          label="Bairro"
          placeholder="Bairro"
          containerClassName="mt-4"
          disabled={isFetchingAddress}
        />
        <TextField
          name="layers[0].address.city"
          label="Cidade"
          placeholder="Cidade"
          containerClassName="mt-4"
          disabled={isFetchingAddress}
        />
        <TextField
          name="layers[0].address.state"
          label="Estado"
          placeholder="Estado"
          formatOnChangeText={text => text.toUpperCase().slice(0, 2)}
          disabled={isFetchingAddress}
          containerClassName="mt-4"
        />
      </ClosableList>
    </section>
  );
};

export default DocumentEditorSideMenuHeader;
