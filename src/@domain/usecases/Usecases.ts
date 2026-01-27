import { LocalStorageDatasource } from '@/@data/datasources/LocalStorageDatasource';
import { DocumentRepository } from '@/@data/repositories/DocumentRepository';
import { Result } from '@/@utils/Result';
import { ListDocumentsUsecase } from './document/ListDocumentsUsecase';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Usecase<Req, Res extends Result<any, any>> {
  execute(req: Req): Promise<Res>;
}

// const documentRepository = ();

export const Usecases = {
  document: {
    list: new ListDocumentsUsecase(
      new DocumentRepository(new LocalStorageDatasource()),
    ),
  },
};
