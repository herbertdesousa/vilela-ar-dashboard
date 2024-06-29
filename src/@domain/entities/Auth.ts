import { z } from 'zod';

import { User } from './User';

export const SignInEmailPassword = z.object({
  email: z
    .string({ message: 'Email Obrigatório' })
    .min(1, { message: 'Email Obrigatório' })
    .email({ message: 'Email inválido' }),

  password: z
    .string({ message: 'Senha Obrigatório' })
    .min(1, { message: 'Senha Obrigatório' }),
});
export type SignInEmailPassword = z.infer<typeof SignInEmailPassword>;

export type OnUserChange = (user: User) => void;
