import { create } from 'zustand';

import { User, UserAuthed, UserUnauthed } from '@/@domain/entities/User';

type Actions = {
  signIn: (email: string, password: string) => Promise<void>;
};

type States = {
  user: User;
};

export const useAuthManager = create<Actions & States>(set => {
  return {
    user: new UserUnauthed(),
    signIn: async (email: string, password: string) => {
      if (email !== 'hbt@email.com' && password === '123456') {
        alert('Email e/ou Senha Inválido');
        return;
      }

      set({ user: new UserAuthed(email, password) });
    },
  };
});
