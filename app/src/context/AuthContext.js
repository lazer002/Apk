// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load tokens & user on app start
  useEffect(() => {
    const loadAuth = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      const userData = await AsyncStorage.getItem('user');
      if (token && userData) {
        setAccessToken(token);
        setUser(JSON.parse(userData));
      }
      setLoading(false);
    };
    loadAuth();
  }, []);

  // Login after OTP verification
  const login = async (userData, token, refreshToken) => {
    setUser(userData);
    setAccessToken(token);
    await AsyncStorage.setItem('accessToken', token);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout user
  const logout = async () => {
    setUser(null);
    setAccessToken(null);
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('user');
  };

  // Axios helper with token
  const authApi = api;
  if (accessToken) {
    authApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, authApi, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
