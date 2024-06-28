import React from 'react';

import { MdChevronLeft, MdDelete } from 'react-icons/md';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { format, addDays } from 'date-fns';

import { useFinance } from '@/hook/finance';
import { IFinanceItem } from '@/types/IFinanceItem';

import moneyFormat from '@/utils/moneyFormat';
import { Button, DatePicker, Switch, TextField } from '@/components';
import { ISaveFinance } from '@/hook/finance/types';

interface ISaveFormProps {
  financeDetails?: IFinanceItem;
  onCloseSaveForm(): void;
}

const schemaValidation = Yup.object().shape({
  value: Yup.string().required('obrigatório'),
  type: Yup.string().required('obrigatório'),
  date: Yup.string().required('obrigatório'),
  description: Yup.string().notRequired(),
});

const FinanceSaveForm: React.FC<ISaveFormProps> = ({
  onCloseSaveForm,
  financeDetails,
}) => {
  const { addFinance, editFinance, deleteFinance } = useFinance();

  const onSubmit = (data: ISaveFinance) => {
    try {
      const parsedData = {
        ...data,
        date: `${format(new Date(data.date), 'yyyy-MM-dd')}`,
        value: data.value
          .replace('R$', '')
          .replace(/\./g, '')
          .replace(',', '.'),
      };
      if (financeDetails) {
        editFinance(parsedData, financeDetails?.id);
      } else {
        addFinance(parsedData);
      }
      onCloseSaveForm();
    } catch (err) {
      console.log(err.response.data);
    }
  };

  return (
    <div className="pt-16 pl-16" style={{ width: 512 }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            type="button"
            className="mr-4 text-accent-4"
            onClick={onCloseSaveForm}
          >
            <MdChevronLeft size={24} />
          </button>
          <h1 className="text-4xl font-merriweather text-accent-6 font-bold">
            {financeDetails ? 'Atualizar' : 'Adicionar'}
          </h1>
        </div>

        {financeDetails && (
          <button
            type="button"
            className="flex items-center text-accent-6 font-medium"
            onClick={() => {
              deleteFinance(financeDetails.id);
              onCloseSaveForm();
            }}
          >
            <MdDelete size={20} className="mr-1 text-red" />
            Deletar
          </button>
        )}
      </div>

      <div className="mt-12">
        <Formik
          enableReinitialize
          initialValues={{
            date: financeDetails?.date
              ? addDays(new Date(financeDetails.date), 1)
              : '',
            type: financeDetails?.type || 'INCOME',
            description: financeDetails?.description || '',
            value: financeDetails?.value
              ? moneyFormat(financeDetails?.value)
              : '',
          }}
          validationSchema={schemaValidation}
          onSubmit={onSubmit}
        >
          {({ submitForm, errors }) => (
            <>
              <TextField
                name="value"
                label="Valor (R$)"
                isRequired
                formatOnChangeText={moneyFormat}
                placeholder="Valor"
              />
              <Switch
                name="type"
                label="Tipo"
                isRequired
                containerClassName="mt-4"
                data={{
                  option1: { label: 'Entrada', value: 'INCOME' },
                  option2: { label: 'Saída', value: 'OUTCOME' },
                }}
              />
              <DatePicker
                name="date"
                label="Data"
                isRequired
                className="mt-4"
              />

              <TextField
                name="description"
                type="textarea"
                label="Descrição"
                containerClassName="mt-4"
                placeholder="Descrição da Financia"
              />
              <Button className="w-full mt-8" onClick={submitForm}>
                {financeDetails ? 'Atualizar Financia' : 'Adicionar Financia'}
              </Button>
            </>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default FinanceSaveForm;
