import React, { createContext, useState, useContext, ReactNode } from 'react';
import api from '../services/api';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  phone: string;
  profilePicture: string | null;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  signIn(email: string, password: string): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  async function signIn(email: string, password: string) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const userData: User = response.data.user;
      const token = response.data.token.token;

      setUser(userData);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        throw new Error('Invalid credentials');
      } else {
        console.error('Erro ao fazer login:', error);
        throw new Error('Erro ao fazer login, tente novamente.');
      }
    }
  }

  async function signOut() {
    try {
      await api.delete('/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
    }
  }

  function updateUser(updatedUser: User) {
    setUser(updatedUser);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
