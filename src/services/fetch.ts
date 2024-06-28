import { api } from './api';

const fetch = async <Data = any>(url: string): Promise<Data> => {
  const res = await api.get<Data>(url);

  return res.data;
};

export { fetch };
