import { DefaultResultError, Result } from '@/@utils/Result';
import { ExceptionHandler } from '@/@utils/ExceptionHandler';
import { OnUserChange } from '@/@domain/entities/Auth';

import { AuthRepository } from '@/@data/repositories/AuthRepository';
import { UserAuthed, UserUnauthed } from '@/@domain/entities/User';
import { Usecase } from '../Usecases';

type Req = OnUserChange;
type Res = Result<{}, DefaultResultError>;

export class OnUserChangeUsecase implements Usecase<Req, Res> {
  constructor(private authRepository: AuthRepository) {}

  @ExceptionHandler()
  async execute(callback: Req): Promise<Res> {
    this.authRepository.onUserChange(user => {
      if (user !== null) {
        callback(new UserAuthed(user.token, user.email));
      } else {
        callback(new UserUnauthed());
      }
    });

    return Result.Success({});
  }
}
