import { useState, useCallback } from 'react';
import { AuthUser } from '@/types';
import { getAuthUser, saveAuthUser, saveRememberMe, getRememberMe } from '@/utils/localStorage';

const MOCK_USERS: Record<string, { password: string; role: 'Admin' | 'Employee'; name: string }> = {
  Admin: { password: 'admin123', role: 'Admin', name: 'Alex Admin' },
  Employee: { password: 'emp123', role: 'Employee', name: 'Emma Employee' },
};

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => getAuthUser());

  const login = useCallback((username: string, password: string, rememberMe: boolean): boolean => {
    const match = MOCK_USERS[username];
    if (!match || match.password !== password) return false;

    const authUser: AuthUser = { username, role: match.role, name: match.name };
    setUser(authUser);
    saveAuthUser(authUser);
    if (rememberMe) {
      saveRememberMe({ username });
    } else {
      saveRememberMe(null);
    }
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    saveAuthUser(null);
  }, []);

  const rememberedUser = getRememberMe();

  return { user, login, logout, rememberedUser };
}
