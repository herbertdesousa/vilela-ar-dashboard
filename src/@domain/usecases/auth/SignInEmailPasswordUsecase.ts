import { DefaultResultError, Result } from '@/@utils/Result';
import { ExceptionHandler } from '@/@utils/ExceptionHandler';
import { SignInEmailPassword } from '@/@domain/entities/Auth';

import { AuthRepository } from '@/@data/repositories/AuthRepository';
import { Usecase } from '../Usecases';

type Req = SignInEmailPassword;
type Res = Result<
  {},
  | DefaultResultError
  | {
      code: 'FORM';
      payload: Partial<Record<keyof SignInEmailPassword, string[]>>;
    }
  | { code: 'INVALID_CREDENTIALS' }
>;

export class SignInEmailPasswordUsecase implements Usecase<Req, Res> {
  constructor(private authRepository: AuthRepository) {}

  @ExceptionHandler()
  async execute(payload: Req): Promise<Res> {
    const { success, error } = SignInEmailPassword.safeParse(payload);

    if (!success) {
      return Result.Error({
        code: 'FORM',
        payload: error.flatten().fieldErrors,
      });
    }

    const { result } = await this.authRepository.signInEmailAndPassword({
      email: payload.email,
      password: payload.password,
    });

    if (result.type === 'ERROR') {
      return Result.Error({ code: 'INVALID_CREDENTIALS' });
    }

    return Result.Success({});
  }
}
