import { createClient } from '@supabase/supabase-js';

import { ExceptionHandler } from '@/@utils/ExceptionHandler';
import { DefaultResultError, Result } from '@/@utils/Result';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

type OnUserChangeReq = (
  user: {
    token: string;
    email: string;
  } | null,
) => void;
type OnUserChangeRes = Result<{}, DefaultResultError>;

type SignInEmailPasswordReq = {
  email: string;
  password: string;
};
type SignInEmailAndPasswordRes = Result<{}, DefaultResultError>;

type SignOutRes = Result<{}, DefaultResultError>;

export class AuthRepository {
  @ExceptionHandler()
  async signOut(): Promise<SignOutRes> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return Result.Error({ code: 'UNKNOWN' });
    }

    return Result.Success({});
  }

  @ExceptionHandler()
  async onUserChange(callback: OnUserChangeReq): Promise<OnUserChangeRes> {
    supabase.auth.onAuthStateChange((_, session) => {
      callback(
        session
          ? { token: session.access_token, email: session.user.email ?? '' }
          : null,
      );
    });

    return Result.Success({});
  }

  @ExceptionHandler()
  async signInEmailAndPassword({
    email,
    password,
  }: SignInEmailPasswordReq): Promise<SignInEmailAndPasswordRes> {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return Result.Error({ code: 'UNKNOWN' });
    }

    return Result.Success({});
  }
}
