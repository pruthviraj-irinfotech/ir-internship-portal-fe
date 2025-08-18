
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AuthData {
  userId: number;
  role: 'user' | 'admin';
  accessToken: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  userId: number | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<{ role: 'admin' | 'user' }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadAuthDataFromStorage = useCallback(() => {
    try {
      const storedData = localStorage.getItem('authData');
      if (storedData) {
        const parsedData: AuthData = JSON.parse(storedData);
        // Add token expiration check here in a real app
        setAuthData(parsedData);
      }
    } catch (error) {
      console.error("Failed to parse auth data from storage", error);
      localStorage.removeItem('authData');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadAuthDataFromStorage();
  }, [loadAuthDataFromStorage]);
  
  const login = async (email: string, pass: string): Promise<{ role: 'admin' | 'user' }> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Login failed');
    }
    
    const newAuthData: AuthData = {
        userId: data.userId,
        role: data.role,
        accessToken: data.accessToken,
    };

    setAuthData(newAuthData);
    localStorage.setItem('authData', JSON.stringify(newAuthData));
    
    return { role: newAuthData.role };
  };

  const logout = () => {
    setAuthData(null);
    localStorage.removeItem('authData');
    router.push('/login');
  };

  if (isLoading) {
    return (
        <div className="flex-1 flex h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-muted-foreground">Loading session...</p>
            </div>
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
        isLoggedIn: !!authData, 
        isAdmin: authData?.role === 'admin',
        userId: authData?.userId || null,
        token: authData?.accessToken || null,
        login, 
        logout 
    }}>
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
