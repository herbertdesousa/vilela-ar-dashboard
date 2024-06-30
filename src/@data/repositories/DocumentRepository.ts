import { ExceptionHandler } from '@/@utils/ExceptionHandler';
import { DefaultResultError, Result } from '@/@utils/Result';

import { z } from 'zod';

import { DocumentModel } from '../models/DocumentModel';
import { LocalStorageDatasource } from '../datasources/LocalStorageDatasource';

type ListReq = {
  page: number;
  itemsPerPage: number;
};
type ListRes = Result<
  DocumentModel[],
  DefaultResultError | { code: 'SERIALIZATION' }
>;

const STORAGE_KEY = '@documents';

export class DocumentRepository {
  constructor(private localStorage: LocalStorageDatasource) {}

  @ExceptionHandler()
  async list({ page, itemsPerPage }: ListReq): Promise<ListRes> {
    const dataStr = this.localStorage.get(STORAGE_KEY);

    if (!dataStr) {
      return Result.Success([]);
    }

    const { success, data } = z.array(DocumentModel).safeParse(dataStr);

    if (!success) {
      return Result.Error({ code: 'SERIALIZATION' });
    }

    const skipItems = page * itemsPerPage;

    return Result.Success(data.slice(skipItems, skipItems + itemsPerPage));
  }
}
