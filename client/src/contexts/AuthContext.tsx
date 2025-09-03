import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se já está logado ao carregar
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      // Verificar se o token ainda é válido (simples verificação de tempo)
      try {
        const tokenData = JSON.parse(atob(token));
        const currentTime = Date.now();
        if (tokenData.expires > currentTime) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('admin_token');
        }
      } catch {
        localStorage.removeItem('admin_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Credenciais simples para acesso administrativo
      if (username === 'admin' && password === 'copa2025') {
        // Criar token simples com expiração de 8 horas
        const tokenData = {
          username,
          loginTime: Date.now(),
          expires: Date.now() + (8 * 60 * 60 * 1000) // 8 horas
        };
        
        const token = btoa(JSON.stringify(tokenData));
        localStorage.setItem('admin_token', token);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
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