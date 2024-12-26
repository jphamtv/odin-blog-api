import { useState, useEffect, createContext, useContext } from 'react';
import { User, LoginCredentials, AuthResponse } from '../types/authTypes';
import { apiClient } from '../utils/apiClient';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = apiClient.getToken();
    if (token) {
      // Verify token and get user data
      apiClient.get<AuthResponse>('/auth/verify')
        .then(response => {
          setUser(response.user);
        })
        .catch(() => {
          apiClient.removeToken();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    apiClient.setToken(response.token);
    setUser(response.user);
  };

  const logout = async () => {
    try {
      await apiClient.get('/auth/logout');
    } finally {
      apiClient.removeToken();
      setUser(null);
    }
  };

  return { user, isLoading, login, logout };
};