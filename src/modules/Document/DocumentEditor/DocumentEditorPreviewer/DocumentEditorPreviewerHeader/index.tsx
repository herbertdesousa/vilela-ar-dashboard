/* eslint-disable import/no-duplicates */
import React, { useMemo } from 'react';
import { useRouter } from 'next/router';

import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import upFirstLetterFormat from '@/utils/upFirstLetterFormat';

import { useDocument } from '@/hook/document';
import { IDocumentFormDataLayersHeader } from '@/hook/document/types/DocumentFormData';
import DocumentEditorPreviewerFocusIndicator from '../DocumentEditorPreviewerFocusIndicator';

interface IDocumentEditorPreviewerHeaderProps {
  type: 'with-header' | 'small';
}

const DocumentEditorPreviewerHeader: React.FC<
  IDocumentEditorPreviewerHeaderProps
> = ({ type: documentType }) => {
  const { layers, type } = useDocument();
  const router = useRouter();

  const header = layers.value.filter(
    i => i.type === 'header',
  )[0] as IDocumentFormDataLayersHeader;

  const formatHeaderDate = useMemo((): string => {
    const date = format(new Date(header.date), 'dd MMMM, yyyy', {
      locale: ptBR,
    });

    const splited = date.split(' ');
    return `${splited[0]} ${upFirstLetterFormat(splited[1])} ${splited[2]}`;
  }, [header.date]);

  const isOnHeaderPage = useMemo((): boolean => {
    return !!router.pathname.split('/').find(i => i === 'header');
  }, [router.pathname]);

  const goToHeaderPage = () => {
    router.push('/documents/editor/header');
  };

  const addressText = useMemo((): string => {
    if (!Object.values(header.address).find(value => value)) return '-';

    const {
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      postalCode,
    } = header.address;

    const cityStateDash = city && state ? '-' : '';
    const streetComma = street && !number && !complement ? ',' : '';
    const numberComma = number && !complement ? ',' : '';
    const complementComma = complement ? ',' : '';
    const neighborhoodComma = neighborhood ? ',' : '';

    // Rua Cabo Oscar Rossini 808 a, Parque Novo Mundo, São Paulo - SP - CEP 02186030
    return `${street}${streetComma} ${number}${numberComma} ${complement}${complementComma} ${neighborhood}${neighborhoodComma} ${city} ${cityStateDash} ${state} ${postalCode}`;
  }, [header.address]);

  if (documentType === 'small') {
    return (
      <div
        className="flex py-12 pl-12 rounded-t"
        style={{ backgroundColor: '#FAFAFC' }}
      >
        <img src="/logo.svg" alt="logo" className="w-12 h-12" />
      </div>
    );
  }
  return (
    <div
      className="flex pt-10 pb-8 px-12 rounded-t"
      style={{ backgroundColor: '#FAFAFC' }}
    >
      <div className="w-1/2">
        <img src="/logo.svg" alt="logo" className="w-12 h-12" />
      </div>
      <div className="w-1/2">
        <div className="whitespace-pre-wrap">
          <h1 className="font-merriweather text-2xl font-bold">
            {upFirstLetterFormat(type)}
            <span className="text-xs ml-2 mb-1 font-inter text-accent-4 font-normal">
              {formatHeaderDate}
            </span>
          </h1>
        </div>

        <div
          role="button"
          tabIndex={0}
          className="mt-6 relative"
          style={{ outline: isOnHeaderPage ? '3px solid #A3CCF3' : 0 }}
          onClick={goToHeaderPage}
          onKeyDown={goToHeaderPage}
        >
          {isOnHeaderPage && <DocumentEditorPreviewerFocusIndicator />}
          <div className="flex flex-col text-xs">
            <strong>Nome/Razão Social:</strong>
            <span>{header.customer.name || '[...]'}</span>
          </div>
          <div className="flex flex-col text-xs mt-2">
            <strong>CPF/CNPJ:</strong>
            <span>{header.customer.document || '-'}</span>
          </div>
          <div className="flex w-full mt-2 justify-between">
            {header.customer.representative && (
              <div className="flex flex-col text-xs">
                <strong>Representante:</strong>
                <span>{header.customer.representative || '-'}</span>
              </div>
            )}
            {header.representative_engineer && (
              <div className="flex flex-col text-xs">
                <strong>Engenheiro:</strong>
                <span>{header.representative_engineer || '-'}</span>
              </div>
            )}
            {header.representative_architect && (
              <div className="flex flex-col text-xs">
                <strong>Arquiteto:</strong>
                <span>{header.representative_architect || '-'}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col text-xs mt-2">
            <strong>Endereço:</strong>
            <span>{addressText}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditorPreviewerHeader;
