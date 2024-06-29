import { DefaultResultError, Result } from '@/@utils/Result';
import { ExceptionHandler } from '@/@utils/ExceptionHandler';

import { AuthRepository } from '@/@data/repositories/AuthRepository';
import { Usecase } from '../Usecases';

type Req = {};
type Res = Result<{}, DefaultResultError>;

export class SignOutUsecase implements Usecase<Req, Res> {
  constructor(private authRepository: AuthRepository) {}

  @ExceptionHandler()
  async execute(): Promise<Res> {
    await this.authRepository.signOut();

    return Result.Success({});
  }
}
