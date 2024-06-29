import { ChangeEvent, FormEvent, useState } from 'react';

import classNames from 'classnames';
import { useSignIn } from './useSignIn';

export function SignIn() {
  const { signIn, isLoading } = useSignIn();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    signIn(email, password);
  }

  function handleChangeEmail(evt: ChangeEvent<HTMLInputElement>) {
    setEmail(evt.target.value);
  }

  function handleChangePassword(evt: ChangeEvent<HTMLInputElement>) {
    setPassword(evt.target.value);
  }

  return (
    <div className="flex items-center justify-center fixed left-0 right-0 bottom-0 top-0 z-50">
      <div className="absolute h-full w-full bg-accent-6 opacity-80" />

      <form
        className="flex flex-col gap-y-4 px-4 py-6 z-10 rounded max-w-xs w-full"
        style={{ backgroundColor: 'white' }}
        onSubmit={handleSubmit}
      >
        <h2 className="font-merriweather font-bold text-2xl">Entrar</h2>

        <div className="flex flex-col gap-y-2">
          <input
            type="email"
            placeholder="seu email"
            className={classNames(
              'px-2 py-2 border border-accent-2 rounded',
              email.length && 'bg-accent-1',
            )}
            onChange={handleChangeEmail}
            required
          />
          <input
            type="password"
            placeholder="sua senha"
            className={classNames(
              'px-2 py-2 border border-accent-2 rounded',
              password.length && 'bg-accent-1',
            )}
            onChange={handleChangePassword}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-primary rounded"
          disabled={isLoading}
          style={{ color: 'white' }}
        >
          {isLoading ? 'Carregando...' : ' Entrar'}
        </button>
      </form>
    </div>
  );
}
