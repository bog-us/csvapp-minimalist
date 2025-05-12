import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Definim tipul pentru utilizator
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth trebuie utilizat în interiorul unui AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Simulăm funcționalitatea de autentificare pentru versiunea minimală
  useEffect(() => {
    // Simulăm un delay pentru a imita verificarea autentificării
    const timeout = setTimeout(() => {
      // Pentru versiunea minimală, setăm un utilizator de test
      // În implementarea reală, aici ar fi Firebase Auth sau alt serviciu
      setCurrentUser({
        uid: 'test-user-id',
        email: 'test@example.com',
        displayName: 'Utilizator Test'
      });
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, []);
  
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      // Simulare login - în implementarea reală, aici ar fi Firebase Auth
      console.log('Login cu:', email, password);
      
      // Simulăm un răspuns de succes după 1 secundă
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentUser({
        uid: 'user-' + Math.random().toString(36).substr(2, 9),
        email: email,
        displayName: email.split('@')[0]
      });
    } catch (error) {
      console.error('Eroare la autentificare:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      // Simulare înregistrare - în implementarea reală, aici ar fi Firebase Auth
      console.log('Înregistrare cu:', email, password);
      
      // Simulăm un răspuns de succes după 1 secundă
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentUser({
        uid: 'user-' + Math.random().toString(36).substr(2, 9),
        email: email,
        displayName: email.split('@')[0]
      });
    } catch (error) {
      console.error('Eroare la înregistrare:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      // Simulare logout - în implementarea reală, aici ar fi Firebase Auth
      console.log('Logout');
      
      // Simulăm un răspuns de succes după 1 secundă
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentUser(null);
    } catch (error) {
      console.error('Eroare la deconectare:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    currentUser,
    loading,
    login,
    register,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};