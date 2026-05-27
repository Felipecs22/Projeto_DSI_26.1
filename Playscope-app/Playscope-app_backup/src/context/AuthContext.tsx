/**
 * AuthContext — disponibiliza o usuário autenticado para toda a app.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { User } from '../models/User';
import { AuthService } from '../services/AuthService';
import { UserRepository } from '../repositories/UserRepository';

interface AuthContextData {
  user:       User | null;
  loading:    boolean;
  setUser:    (u: User | null) => void;
  logout:     () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({
  user:        null,
  loading:     true,
  setUser:     () => {},
  logout:      async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const authService = AuthService.getInstance();
  const userRepo    = new UserRepository();

  useEffect(() => {
    const unsub = authService.onAuthChanged(async (fbUser) => {
      if (fbUser) {
        const profile = await userRepo.findById(fbUser.uid);
        if (profile) {
          await userRepo.saveUser(profile);
        }
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    const fbUser = authService.currentFirebaseUser;
    if (!fbUser) return;
    const profile = await userRepo.findById(fbUser.uid);
    setUser(profile);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
