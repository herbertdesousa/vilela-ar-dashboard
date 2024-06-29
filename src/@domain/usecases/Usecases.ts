import { Result } from '@/@utils/Result';
import { AuthRepository } from '@/@data/repositories/AuthRepository';
import { SignInEmailPasswordUsecase } from './auth/SignInEmailPasswordUsecase';
import { OnUserChangeUsecase } from './auth/OnUserChangeUsecase';
import { SignOutUsecase } from './auth/SignOutUsecase';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Usecase<Req, Res extends Result<any, any>> {
  execute(req: Req): Promise<Res>;
}

const authRepository = new AuthRepository();

export const Usecases = {
  auth: {
    signInEmailPassword: new SignInEmailPasswordUsecase(authRepository),
    onUserChange: new OnUserChangeUsecase(authRepository),
    signOut: new SignOutUsecase(authRepository),
  },
};
