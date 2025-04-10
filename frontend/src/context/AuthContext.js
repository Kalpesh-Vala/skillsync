import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password
      });
      
      if (response.data.status === 'success') {
        setAccessToken(response.data.data.accessToken);
        // Set default authorization header for all subsequent requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.accessToken}`;
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (username, email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        username,
        email,
        password
      });
      
      if (response.data.status === 'success') {
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:3000/api/auth/logout');
      setAccessToken(null);
      setUser(null);
      // Remove authorization header
      delete axios.defaults.headers.common['Authorization'];
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during logout');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/refresh');
      if (response.data.status === 'success') {
        setAccessToken(response.data.data.accessToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.accessToken}`;
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to refresh token');
      return false;
    }
  }, []);

  const value = {
    accessToken,
    user,
    loading,
    error,
    login,
    register,
    logout,
    refreshToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}