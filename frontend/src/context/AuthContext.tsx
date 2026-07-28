import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  fullName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('eduverse_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('eduverse_token') || null;
  });

  const isAuthenticated = !!token && !!user;

  const login = async (email: string, _pass: string): Promise<boolean> => {
    try {
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eduverse_access_token";
      const userData: User = {
        id: "usr_101",
        fullName: email.split('@')[0].toUpperCase(),
        email: email,
      };

      localStorage.setItem('eduverse_token', mockToken);
      localStorage.setItem('eduverse_user', JSON.stringify(userData));
      setToken(mockToken);
      setUser(userData);
      return true;
    } catch {
      return false;
    }
  };

  const signup = async (fullName: string, email: string, _pass: string): Promise<boolean> => {
    try {
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eduverse_access_token";
      const userData: User = {
        id: "usr_" + Date.now(),
        fullName: fullName,
        email: email,
      };

      localStorage.setItem('eduverse_token', mockToken);
      localStorage.setItem('eduverse_user', JSON.stringify(userData));
      setToken(mockToken);
      setUser(userData);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('eduverse_token');
    localStorage.removeItem('eduverse_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
