import React, { useCallback, useState } from 'react';

import { getDaysInMonth } from 'date-fns';

import useSWR from 'swr';
import resources from '@/services/resources';
import { IFinanceItem } from '@/types/IFinanceItem';

import { api } from '@/services/api';
import { FinanceContext } from './context';
import {
  FinanceFilterType,
  IFinanceFilterDateMonthItem,
  IFinanceFilterDateItem,
  ISaveFinance,
} from './types';

export const FinanceProvider: React.FC = ({ children }) => {
  const [filterFinanceType, setFilterFinanceType] =
    useState<FinanceFilterType>('ALL');

  const [filterDataDays, setFilterDataDays] = useState<
    IFinanceFilterDateItem[]
  >(() => {
    const today = new Date(Date.now());
    return Array(getDaysInMonth(today))
      .fill('')
      .map((_, i) => ({
        value: String(i + 1),
        isActive: i + 1 === today.getDate(),
      }));
  });

  const [filterDataMonths, setFilterDataMonths] = useState<
    IFinanceFilterDateMonthItem[]
  >(() => {
    const months = [
      { slug: 'Jan', label: 'Janeiro', value: '01' },
      { slug: 'Fev', label: 'Feveveiro', value: '02' },
      { slug: 'Mar', label: 'Março', value: '03' },
      { slug: 'Abr', label: 'Abril', value: '04' },
      { slug: 'Mai', label: 'Maio', value: '05' },
      { slug: 'Jun', label: 'Junho', value: '06' },
      { slug: 'Jul', label: 'Julho', value: '07' },
      { slug: 'Ago', label: 'Agosto', value: '08' },
      { slug: 'Set', label: 'Setembro', value: '09' },
      { slug: 'Out', label: 'Outubro', value: '10' },
      { slug: 'Nov', label: 'Novembro', value: '11' },
      { slug: 'Dez', label: 'Dezembro', value: '12' },
    ];
    const today = new Date(Date.now());
    return months.map((i, idx) => ({
      ...i,
      isActive: idx + 1 === today.getMonth() + 1,
    }));
  });

  const [filterDataYear, setFilterDataYear] = useState<
    IFinanceFilterDateItem[]
  >(() => {
    const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
    const today = new Date(Date.now());
    return years.map(i => ({
      value: String(i),
      isActive: i === today.getFullYear(),
    }));
  });

  const { data, mutate } = useSWR<IFinanceItem[]>(
    // eslint-disable-next-line prettier/prettier
    // `${resources.finances}?date=${filterDataYear.find(i => i.isActive).value}-${filterDataMonths.find(i => i.isActive).value}-${filterDataDays.find(i => i.isActive).value}${filterFinanceType !== 'ALL' ? `&type=${filterFinanceType}` : ''}`,
    undefined,
  );

  const addFinance = useCallback(
    async (payload: ISaveFinance) => {
      await api.post(resources.finances, payload);
      mutate();
    },
    [mutate],
  );

  const editFinance = useCallback(
    async (payload: ISaveFinance, id: number) => {
      await api.patch(`${resources.finances}/${id}`, payload);
      mutate();
    },
    [mutate],
  );

  const deleteFinance = useCallback(
    async (id: number) => {
      await api.delete(`${resources.finances}/${id}`);
      mutate();
    },
    [mutate],
  );

  return (
    <FinanceContext.Provider
      value={{
        finances: data || [],
        isLoading: typeof data === 'undefined',
        isEmpty: typeof data !== 'undefined' && data.length === 0,
        refresh: mutate,
        addFinance,
        editFinance,
        deleteFinance,
        filters: {
          type: {
            value: filterFinanceType,
            set: setFilterFinanceType,
          },
          date: {
            days: {
              value: filterDataDays,
              active: filterDataDays.find(i => i.isActive),
              set: setFilterDataDays,
            },
            months: {
              value: filterDataMonths,
              active: filterDataMonths.find(i => i.isActive),
              set: setFilterDataMonths,
            },
            years: {
              value: filterDataYear,
              active: filterDataYear.find(i => i.isActive),
              set: setFilterDataYear,
            },
          },
        },
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
