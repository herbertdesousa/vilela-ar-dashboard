import { useState } from 'react';
import { useAuthManager } from '../managers/AuthManager';

export function useSignIn() {
  const authManager = useAuthManager();

  const [isLoading, setIsLoading] = useState(false);

  async function signIn(email: string, password: string) {
    try {
      setIsLoading(true);

      await authManager.signIn(email, password);
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, signIn };
}
