'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => 'admin' | 'user' | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // This is a placeholder for checking a token in localStorage, for example.
    // For now, we just assume the user is logged out on initial load.
    setIsLoading(false);
  }, []);

  const login = (email: string, pass: string): 'admin' | 'user' | null => {
    // Admin credentials
    if (email === 'admin@email.com' && pass === 'adminpassword') {
      setIsLoggedIn(true);
      setIsAdmin(true);
      return 'admin';
    }
    // Dummy credentials
    if (email === 'player1@email.com' && pass === 'password123') {
      setIsLoggedIn(true);
      setIsAdmin(false);
      // Redirection is now handled by the component that calls login.
      return 'user';
    }
    return null;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    router.push('/login');
  };

  if (isLoading) {
    return null; // Or a loading spinner screen
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
