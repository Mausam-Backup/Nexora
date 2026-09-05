import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  collegeName?: string;
  role?: 'student' | 'admin' | 'teacher' | 'parent' | 'examination_controller';
  semester?: number;
  branch?: string;
  subjects?: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Synchronous initialization prevents race condition on initial render / fast redirects
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('campussync-user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Error parsing saved user data on init:', error);
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Secondary sync verification
    const savedUser = localStorage.getItem('campussync-user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (!user || user.id !== parsed.id || user.role !== parsed.role) {
          setUser(parsed);
        }
      } catch (error) {
        localStorage.removeItem('campussync-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    // Write to storage immediately so route guards immediately see the session
    try {
      localStorage.setItem('campussync-user', JSON.stringify(userData));
    } catch (e) {
      console.error('Failed to write user to localStorage:', e);
    }
    setUser(userData);
  };

  const logout = () => {
    try {
      localStorage.removeItem('campussync-user');
    } catch (e) {}
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};