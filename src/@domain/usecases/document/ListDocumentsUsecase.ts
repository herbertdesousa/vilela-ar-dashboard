import { DefaultResultError, Result } from '@/@utils/Result';
import { ExceptionHandler } from '@/@utils/ExceptionHandler';

import { DocumentRepository } from '@/@data/repositories/DocumentRepository';

import { DocumentListed } from '@/@domain/entities/Document';
import { Usecase } from '../Usecases';

type Req = { page: number; itemsPerPage: number };
type Res = Result<
  { data: DocumentListed[]; enableNext: boolean; enablePrev: boolean },
  DefaultResultError
>;

export class ListDocumentsUsecase implements Usecase<Req, Res> {
  constructor(private documentRepository: DocumentRepository) {}

  @ExceptionHandler()
  async execute({ page, itemsPerPage }: Req): Promise<Res> {
    const { result } = await this.documentRepository.list({
      page,
      itemsPerPage,
    });

    if (result.type === 'ERROR') {
      return Result.Error({ code: 'UNKNOWN' });
    }

    const data = result.payload.map(DocumentListed.fromModel);

    return Result.Success({
      data,
      enableNext: data.length === itemsPerPage,
      enablePrev: page !== 0,
    });
  }
}
