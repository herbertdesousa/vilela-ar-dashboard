import React, { useState } from 'react';
import Head from 'next/head';

import { Nav } from '@/components';
import { FinanceSideMenu, FinanceSaveForm } from '@/modules/Finance';

import { IFinanceItem } from '@/types/IFinanceItem';

const Finance: React.FC = () => {
  const [financeDetails, setFinanceDetails] = useState<
    IFinanceItem | undefined
  >();
  const [isSaveFormShowing, setIsSaveFormShowing] = useState(false);

  return (
    <>
      <Head>
        <title>Financias</title>
      </Head>
      <div />

      <div className="flex max-h-screen">
        <Nav />

        <div className="flex">
          <FinanceSideMenu
            onClickAddFinance={() => {
              setIsSaveFormShowing(true);
              setFinanceDetails(undefined);
            }}
            onClickEditFinance={data => {
              setIsSaveFormShowing(true);
              setFinanceDetails(data);
            }}
            onCloseSaveForm={() => setIsSaveFormShowing(false)}
          />
          {isSaveFormShowing && (
            <FinanceSaveForm
              financeDetails={financeDetails}
              onCloseSaveForm={() => setIsSaveFormShowing(false)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Finance;
