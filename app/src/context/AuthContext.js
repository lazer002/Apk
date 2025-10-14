// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform, Alert } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { api } from '../utils/config';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Google Auth
const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  clientId: '473818401181-cq7stplcji2vvh7hg0uanq8f8hqcj6tv.apps.googleusercontent.com',
});

  // Storage helper
  const storage = {
    getItem: async (key) => {
      try {
        if (Platform.OS === 'web') return localStorage.getItem(key);
        if (['accessToken', 'refreshToken'].includes(key)) {
          return await SecureStore.getItemAsync(key);
        }
        return await AsyncStorage.getItem(key);
      } catch (err) {
        console.error(`Failed to get ${key}:`, err);
        return null;
      }
    },
    setItem: async (key, value) => {
      try {
        if (Platform.OS === 'web') return localStorage.setItem(key, value);
        if (['accessToken', 'refreshToken'].includes(key)) {
          return await SecureStore.setItemAsync(key, value);
        }
        return await AsyncStorage.setItem(key, value);
      } catch (err) {
        console.error(`Failed to set ${key}:`, err);
      }
    },
    removeItem: async (key) => {
      try {
        if (Platform.OS === 'web') return localStorage.removeItem(key);
        if (['accessToken', 'refreshToken'].includes(key)) {
          return await SecureStore.deleteItemAsync(key);
        }
        return await AsyncStorage.removeItem(key);
      } catch (err) {
        console.error(`Failed to remove ${key}:`, err);
      }
    },
  };

  /** Load auth data on app startup */
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const token = await storage.getItem('accessToken');
        const userData = await storage.getItem('user');
        if (token && userData) {
          setAccessToken(token);
          setUser(JSON.parse(userData));
        }
      } catch (err) {
        console.error('Failed to load auth data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAuth();
  }, []);

  /** Email/OTP login */
  const login = async (userData, token, refreshToken) => {
    try {
      setUser(userData);
      setAccessToken(token);

      await storage.setItem('accessToken', token);
      await storage.setItem('refreshToken', refreshToken);
      await storage.setItem('user', JSON.stringify(userData));

      // Merge guest cart if exists
      const guestCart = await AsyncStorage.getItem('guestCart');
      if (guestCart) {
        await api.post(
          '/api/cart/merge',
          { items: JSON.parse(guestCart) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await AsyncStorage.removeItem('guestCart');
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  /** Logout */
  const logout = async () => {
    try {
      setUser(null);
      setAccessToken(null);

      await storage.removeItem('accessToken');
      await storage.removeItem('refreshToken');
      await storage.removeItem('user');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const promptGoogleLogin = async () => {
    try {
      const result = await promptAsync({ useProxy: true });
      if (result.type === 'success') {
        const idToken = result.params.id_token;
        // Send token to your backend
        const res = await api.post('/api/auth/google', { token: idToken });
        if (res.data?.token && res.data?.user) {
          await login(res.data.user, res.data.token, res.data.refreshToken);
        } else {
          Alert.alert('Error', 'Google login failed');
        }
      }
    } catch (err) {
      console.error('Google login failed', err);
      Alert.alert('Error', 'Google login failed');
    }
  };
  /** Configure API headers dynamically */
  const authApi = api;
  if (accessToken) {
    authApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  } else {
    delete authApi.defaults.headers.common['Authorization'];
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        authApi,
        loading,
        request, // export request if needed
        promptGoogleLogin, // call this in your AuthScreen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
