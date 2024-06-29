import { create } from 'zustand';

import { User, UserLoading, UserUnauthed } from '@/@domain/entities/User';
import { Usecases } from '@/@domain/usecases/Usecases';

type Actions = {
  signOut(): Promise<void>;
};

type States = {
  user: User;
};

export const useAuthManager = create<Actions & States>(set => {
  Usecases.auth.onUserChange.execute(user => set({ user }));

  return {
    user: new UserLoading(),
    signOut: async () => {
      set({ user: new UserUnauthed() });
      await Usecases.auth.signOut.execute();
    },
  };
});
