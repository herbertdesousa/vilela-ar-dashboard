export interface IFinanceItem {
  id: number;
  date: string;
  value: number;
  type: 'INCOME' | 'OUTCOME';
  description: string;
}
