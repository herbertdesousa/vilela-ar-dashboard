import { Result } from '@/@utils/Result';
import { AuthRepository } from '@/@data/repositories/AuthRepository';
import { DocumentRepository } from '@/@data/repositories/DocumentRepository';
import { LocalStorageDatasource } from '@/@data/datasources/LocalStorageDatasource';
import { SignInEmailPasswordUsecase } from './auth/SignInEmailPasswordUsecase';
import { OnUserChangeUsecase } from './auth/OnUserChangeUsecase';
import { SignOutUsecase } from './auth/SignOutUsecase';
import { ListDocumentsUsecase } from './document/ListDocumentsUsecase';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Usecase<Req, Res extends Result<any, any>> {
  execute(req: Req): Promise<Res>;
}

// const documentRepository = ();
const authRepository = new AuthRepository();

export const Usecases = {
  auth: {
    signInEmailPassword: new SignInEmailPasswordUsecase(authRepository),
    onUserChange: new OnUserChangeUsecase(authRepository),
    signOut: new SignOutUsecase(authRepository),
  },
  document: {
    list: new ListDocumentsUsecase(
      new DocumentRepository(new LocalStorageDatasource()),
    ),
  },
};
