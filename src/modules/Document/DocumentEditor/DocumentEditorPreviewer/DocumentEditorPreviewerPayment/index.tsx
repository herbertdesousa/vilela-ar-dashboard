import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

import { useResizeDetector } from 'react-resize-detector';

import { useDocument } from '@/hook/document';

import {
  IDocumentFormDataLayersBlock,
  IDocumentFormDataLayersHeader,
  IDocumentFormDataLayersPayment,
} from '@/hook/document/types/DocumentFormData';
import moneyFormat from '@/utils/moneyFormat';
import onlyNumbersFormat from '@/utils/onlyNumbersFormat';
import DocumentEditorPreviewerFocusIndicator from '../DocumentEditorPreviewerFocusIndicator';

interface IDocumentEditorPreviewerPaymentProps {
  block: IDocumentFormDataLayersPayment;
}

const DocumentEditorPreviewerPayment: React.FC<
  IDocumentEditorPreviewerPaymentProps
> = ({ block }) => {
  const { layers, show_company_info, show_signatures } = useDocument();
  const router = useRouter();

  const header = layers.value.filter(
    i => i.type === 'header',
  )[0] as IDocumentFormDataLayersHeader;
  const payment = layers.value.filter(
    i => i.type === 'payment',
  )[0] as IDocumentFormDataLayersPayment;
  const blocks = layers.value.filter(
    i => i.type === 'block',
  ) as IDocumentFormDataLayersBlock[];

  const priceTotal = useMemo(() => {
    const prices = blocks
      .filter(b => b.price)
      .map(i => Number(onlyNumbersFormat(i.price)));

    return moneyFormat(prices.reduce((a, b) => a + b, 0)) || 'R$0,00';
  }, [blocks]);

  const isOnPaymentPage = useMemo((): boolean => {
    return !!router.pathname.split('/').find(i => i === 'payment');
  }, [router.pathname]);

  const pushPaymentPage = () => {
    router.push('/documents/editor/payment');
  };

  const containerMeasuresRef = useResizeDetector();

  useEffect(() => {
    layers.saveBlockInPageMeasures({
      ...block,
      height: containerMeasuresRef.height,
      width: containerMeasuresRef.width,
    });
  }, [containerMeasuresRef.height, containerMeasuresRef.width]);

  return (
    <div
      className="absolute bottom-6 w-full pr-10"
      ref={containerMeasuresRef.ref}
      style={{ width: 'calc(100% - 40px)' }}
    >
      {show_signatures && (
        <div className="flex justify-between flex-col mb-16 mt-12">
          <div>
            <div className="mb-16 text-xs">
              E por estarem de acordo, firmam o presente em duas vias.
              <br />
              {`1° Via - ${header.customer.name}`}
              <br />
              2° Via - Vilela Ar
            </div>
            <div className="flex justify-center border-t border-accent-6 pt-4 px-4 text-xs w-48">
              <strong>(CONTRATANTE)</strong>
            </div>
          </div>
          <div className="flex self-end mt-20">
            <div className="flex justify-center border-t border-accent-6 pt-4 px-4 text-xs w-48">
              <strong>(CONTRATANTE)</strong>
            </div>
          </div>
        </div>
      )}
      <div className="flex w-full justify-between items-center">
        <div className="text-xs">
          {show_company_info && (
            <>
              <span>CNPJ: 29.429.191/0001-93</span>
              <br />
              <span>Dono: José Aparecido Vilela</span>
            </>
          )}
        </div>
        <div
          role="button"
          tabIndex={0}
          style={{
            width: 242,
            outline: isOnPaymentPage ? '3px solid #A3CCF3' : 0,
          }}
          className="relative border-t border-accent-6 pt-4 px-4 text-xs"
          onClick={pushPaymentPage}
          onKeyDown={pushPaymentPage}
        >
          {isOnPaymentPage && <DocumentEditorPreviewerFocusIndicator />}
          <ul>
            {blocks
              .filter(i => i.price)
              .map((b, index) => (
                <div
                  key={b.id}
                  className={`flex justify-between ${
                    index !== 0 ? 'mt-1' : ''
                  }`}
                >
                  <span style={{ maxWidth: 128 }}>{b.title}</span>
                  <span>{b.price}</span>
                </div>
              ))}
            <div className="flex justify-between mt-2">
              <span>Total</span>
              <strong>{priceTotal}</strong>
            </div>
          </ul>
          <p className="mt-4 text-accent-4">{payment.comments}</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditorPreviewerPayment;
