'use client';

import { useState, useCallback, useEffect } from 'react';
import { User } from '@/types';

const AUTH_STORAGE_KEY = 'kinnk-user';
const TOKEN_STORAGE_KEY = 'kinnk-token';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (error) {
        console.error('Failed to load auth from storage:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        // TODO: Replace with actual API call
        // const response = await apiClient.login(email, password);

        // Mock login
        const mockUser: User = {
          id: 'user-1',
          email,
          firstName: 'John',
          lastName: 'Doe',
          createdAt: new Date().toISOString(),
          preferences: {
            newsletter: false,
            marketing: false,
            notifications: true,
          },
        };

        const mockToken = `token-${Date.now()}`;

        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
        localStorage.setItem(TOKEN_STORAGE_KEY, mockToken);

        setUser(mockUser);
        setToken(mockToken);

        return { success: true, user: mockUser };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Login failed';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const signup = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      setIsLoading(true);
      setError(null);

      try {
        // TODO: Replace with actual API call
        // const response = await apiClient.signup(email, password, firstName, lastName);

        // Mock signup
        const mockUser: User = {
          id: `user-${Date.now()}`,
          email,
          firstName,
          lastName,
          createdAt: new Date().toISOString(),
          preferences: {
            newsletter: false,
            marketing: false,
            notifications: true,
          },
        };

        const mockToken = `token-${Date.now()}`;

        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
        localStorage.setItem(TOKEN_STORAGE_KEY, mockToken);

        setUser(mockUser);
        setToken(mockToken);

        return { success: true, user: mockUser };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Signup failed';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
    setToken(null);
  }, []);

  const isAuthenticated = !!user && !!token;

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
  };
}
