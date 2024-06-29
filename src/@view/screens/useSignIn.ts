import { useState } from 'react';

import { Usecases } from '@/@domain/usecases/Usecases';

export function useSignIn() {
  const [isLoading, setIsLoading] = useState(false);

  async function signIn(email: string, password: string) {
    try {
      setIsLoading(true);

      const { result } = await Usecases.auth.signInEmailPassword.execute({
        email,
        password,
      });

      if (result.type === 'ERROR') {
        switch (result.data.code) {
          case 'FORM':
            alert(
              `Erro de formulario: \n${Object.values(result.data.payload).join(
                ', ',
              )}`,
            );

            break;
          case 'INVALID_CREDENTIALS':
            alert('Email e/ou Senha Inválido');

            break;
          default:
            alert('Erro de formulario');
            break;
        }

        return;
      }
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, signIn };
}
