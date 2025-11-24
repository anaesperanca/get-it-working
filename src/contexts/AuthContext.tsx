import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  username: string;
  nome: string;
  role: 'utente' | 'medico';
  utente?: string;
  patientId?: string;
  numero?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => { ok: boolean; reason?: string };
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock database
const DB_USERS: Record<string, User & { pass: string }> = {
  utente123: {
    role: "utente",
    username: "utente123",
    nome: "Bernardo Silva",
    utente: "123456789",
    pass: "1234",
    patientId: "c123"
  },
  medico1: {
    role: "medico",
    username: "medico1",
    nome: "Dra. Rita Almeida",
    numero: "OM-12345",
    pass: "1234"
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('SNS24_SESSION');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('SNS24_SESSION');
      }
    }
  }, []);

  const login = (username: string, password: string) => {
    const userKey = username.trim().toLowerCase();
    const dbUser = DB_USERS[userKey];

    if (!dbUser) {
      return { ok: false, reason: 'user_not_found' };
    }

    if (dbUser.pass !== password) {
      return { ok: false, reason: 'wrong_password' };
    }

    const { pass, ...userData } = dbUser;
    setUser(userData);
    localStorage.setItem('SNS24_SESSION', JSON.stringify(userData));

    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('SNS24_SESSION');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
