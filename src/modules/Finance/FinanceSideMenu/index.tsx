import React, { useEffect, useRef } from 'react';

import moneyFormat from '@/utils/moneyFormat';

import { IFinanceItem } from '@/types/IFinanceItem';

import { Button, ListItem, Select } from '@/components';
import { MdChevronRight, MdChevronLeft, MdAdd } from 'react-icons/md';
import { useFinance } from '@/hook/finance';
import { Formik } from 'formik';

interface ISideMenu {
  onClickEditFinance(financeItem: IFinanceItem): void;
  onClickAddFinance(): void;
  onCloseSaveForm(): void;
}

const FinanceSideMenu: React.FC<ISideMenu> = ({
  onClickAddFinance,
  onClickEditFinance,
  onCloseSaveForm,
}) => {
  const { finances, isLoading, isEmpty, filters } = useFinance();

  const topDivRef = useRef<HTMLDivElement>(null);
  const carrouselDaysRef = useRef<HTMLUListElement>(null);

  const [listFinanceHeight, setListFinanceHeight] = React.useState(210);
  useEffect(() => {
    if (!process.browser) setListFinanceHeight(210);
    else
      setListFinanceHeight(
        window.innerHeight - topDivRef.current?.clientHeight,
      );
  }, []);

  useEffect(() => {
    const scrollItem =
      carrouselDaysRef.current?.scrollWidth /
      (filters.date.days.value.length + 1);

    carrouselDaysRef.current?.scroll({
      left: scrollItem * (Number(filters.date.days.active.value) - 3.5),
      behavior: 'smooth',
    });
  }, [filters.date.days.active.value, filters.date.days.value.length]);

  const onChangeMonth = (month: string) => {
    onCloseSaveForm();
    filters.date.months.set(st =>
      st.map(i =>
        i.value === month
          ? { ...i, isActive: true }
          : { ...i, isActive: false },
      ),
    );
  };

  const onChangeDay = (day: string) => {
    onCloseSaveForm();
    filters.date.days.set(st =>
      st.map(i =>
        i.value === day ? { ...i, isActive: true } : { ...i, isActive: false },
      ),
    );
  };

  const onChangeYear = (year: string) => {
    onCloseSaveForm();
    filters.date.years.set(st =>
      st.map(i =>
        i.value === year ? { ...i, isActive: true } : { ...i, isActive: false },
      ),
    );
  };

  return (
    <section
      className="border-r border-accent-2 max-h-screen"
      style={{ width: 512 }}
    >
      <div ref={topDivRef} className="pb-6 pt-12">
        <div className="flex justify-between items-center px-6">
          <div className="flex items-center">
            <button
              type="button"
              className="p-2 border border-accent-2 hover:bg-accent-1 rounded transition mr-2"
              onClick={() => {
                carrouselDaysRef.current?.scrollTo({
                  left: carrouselDaysRef.current?.scrollLeft - 100,
                  behavior: 'smooth',
                });
              }}
            >
              <MdChevronLeft size={16} />
            </button>
            <button
              type="button"
              className="p-2 border border-accent-2 hover:bg-accent-1 rounded transition"
              onClick={() => {
                carrouselDaysRef.current?.scrollTo({
                  left: carrouselDaysRef.current?.scrollLeft + 100,
                  behavior: 'smooth',
                });
              }}
            >
              <MdChevronRight size={16} />
            </button>
          </div>
          <Formik initialValues={{}} onSubmit={() => console.log('')}>
            {({ errors }) => (
              <div className="flex">
                <Select
                  name="months"
                  data={filters.date.months.value.map(i => ({
                    ...i,
                    label: i.slug,
                  }))}
                  buttonClassName="w-40"
                  onSelect={item => onChangeMonth(item.value)}
                  label={filters.date.months.active.label}
                />
                <Select
                  name="years"
                  data={filters.date.years.value}
                  className="ml-4"
                  onSelect={item => onChangeYear(item.value)}
                  label={filters.date.years.active.value}
                />
              </div>
            )}
          </Formik>
        </div>

        <ul
          ref={carrouselDaysRef}
          className="flex max-w-full overflow-scroll no-scroll mt-3 px-6"
        >
          {filters.date.days.value.map((item, index) => (
            <li key={item.value}>
              <button
                type="button"
                onClick={() => onChangeDay(item.value)}
                className={`
                flex flex-col items-center justify-center w-16 h-20 border border-accent-2 rounded
                hover:bg-accent-1 transition
                ${filters.date.days.value.length - 1 !== index && 'mr-3'}
                ${item.isActive && 'border-0 bg-accent-6  hover:bg-accent-6'}
              `}
              >
                <span
                  className={`
                  text-xs mb-3 ${
                    item.isActive ? 'text-accent-0' : 'text-accent-3'
                  }
                `}
                >
                  day
                </span>
                <strong
                  className={`
                  text-3xl font-medium
                  ${item.isActive ? 'text-accent-0' : 'text-accent-6'}
                `}
                >
                  {item.value}
                </strong>
              </button>
            </li>
          ))}
        </ul>

        <div className="flex justify-between px-6 mt-6">
          <Button
            variant="outline"
            size="sm"
            className={filters.type.value === 'ALL' && 'bg-accent-1'}
            onClick={() => filters.type.set('ALL')}
          >
            Todos
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={filters.type.value === 'INCOME' && 'bg-accent-1'}
            onClick={() => filters.type.set('INCOME')}
          >
            Somente Entradas
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={filters.type.value === 'OUTCOME' && 'bg-accent-1'}
            onClick={() => filters.type.set('OUTCOME')}
          >
            Somente Saídas
          </Button>
        </div>

        <div className="w-full border-b border-accent-2 my-6" />

        <div className="px-6 flex justify-between items-center">
          <h2 className="font-merriweather font-bold text-xl">
            Resultados&nbsp;
            <span className="text-accent-3">
              {finances?.length ? `(${finances.length})` : ''}
            </span>
          </h2>

          <Button
            variant="outline"
            size="sm"
            leftIcon={MdAdd}
            onClick={onClickAddFinance}
          >
            Adicionar
          </Button>
        </div>
      </div>

      <ul
        className="overflow-y-scroll no-scroll pb-6"
        style={{ height: listFinanceHeight }}
      >
        {isLoading && (
          <p className="mt-6 w-full text-center text-accent-3">
            Carregando Financias
          </p>
        )}
        {isEmpty && (
          <p className="w-full text-center text-accent-3 mt-6">
            Nenhum Financia Adicionada
          </p>
        )}
        {(finances || []).map((item, index) => (
          <ListItem
            title={`${item.type === 'INCOME' ? '' : '-'} ${moneyFormat(
              item.value,
            )}`}
            description={item.description || ''}
            key={item.id}
            rightComponent={{
              icon: MdChevronRight,
            }}
            onClick={() => onClickEditFinance(item)}
            showBottomIndicator={finances.length - 1 !== index}
            className={index !== 0 && 'mt-2'}
          />
        ))}
      </ul>
    </section>
  );
};

export default FinanceSideMenu;
