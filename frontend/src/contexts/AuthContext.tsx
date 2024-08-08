import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []);

  async function signIn(email: string, password: string) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const userData: User = response.data.user;
      const token = response.data.token.token;

      setUser(userData);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
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
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }

  function updateUser(updatedUser: User) {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
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
