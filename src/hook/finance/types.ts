import { IFinanceItem } from '@/types/IFinanceItem';

export type FinanceFilterType = 'ALL' | 'INCOME' | 'OUTCOME';
export interface IFinanceFilterDateMonthItem extends IFinanceFilterDateItem {
  slug: string;
  label: string;
}
export interface IFinanceFilterDateItem {
  value: string;
  isActive: boolean;
}
export interface ISaveFinance {
  date: string | Date;
  type: string;
  description: string;
  value: string;
}

export interface IFinanceContextData {
  finances: IFinanceItem[];
  refresh(): void;
  isLoading: boolean;
  isEmpty: boolean;
  addFinance(data: ISaveFinance): Promise<void>;
  editFinance(data: ISaveFinance, id: number): Promise<void>;
  deleteFinance: (id: number) => Promise<void>;
  filters: {
    type: {
      value: FinanceFilterType;
      set: React.Dispatch<React.SetStateAction<FinanceFilterType>>;
    };
    date: {
      days: {
        value: IFinanceFilterDateItem[];
        active: IFinanceFilterDateItem | undefined;
        set: React.Dispatch<React.SetStateAction<IFinanceFilterDateItem[]>>;
      };
      months: {
        value: IFinanceFilterDateMonthItem[];
        active: IFinanceFilterDateMonthItem | undefined;
        set: React.Dispatch<
          React.SetStateAction<IFinanceFilterDateMonthItem[]>
        >;
      };
      years: {
        value: IFinanceFilterDateItem[];
        active: IFinanceFilterDateItem | undefined;
        set: React.Dispatch<React.SetStateAction<IFinanceFilterDateItem[]>>;
      };
    };
  };
}
