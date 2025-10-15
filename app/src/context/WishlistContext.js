import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/config';
import { useAuth } from '../context/AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?._id;

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper: load guest wishlist from AsyncStorage
  const loadGuestWishlist = async () => {
    try {
      const data = await AsyncStorage.getItem('guestWishlist');
      setWishlist(data ? JSON.parse(data) : []);
    } catch (err) {
      console.log('Error loading guest wishlist:', err);
    }
  };

  // Save guest wishlist to AsyncStorage
  const saveGuestWishlist = async (list) => {
    try {
      await AsyncStorage.setItem('guestWishlist', JSON.stringify(list));
    } catch (err) {
      console.log('Error saving guest wishlist:', err);
    }
  };

  // Fetch wishlist from server (for logged-in users)
  const fetchWishlist = async () => {
    if (!userId) return loadGuestWishlist();

    try {
      setLoading(true);
      const { data } = await api.get(`/api/wishlist/${userId}`);
      setWishlist(data.wishlist || []);
    } catch (err) {
      console.log('Fetch wishlist error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add to wishlist
  const addToWishlist = async (productId) => {
    if (!userId) {
      // guest user
      const newList = [...wishlist, productId];
      setWishlist(newList);
      saveGuestWishlist(newList);
      // Alert.alert('Added', 'Product added to wishlist');
      return;
    }

    // logged-in user
    try {
      await api.post('/api/wishlist/add', { userId, productId });
      fetchWishlist();
      Alert.alert('Added', 'Product added to wishlist');
    } catch (err) {
      console.log('Add wishlist error:', err);
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    if (!userId) {
      const newList = wishlist.filter(id => id !== productId);
      setWishlist(newList);
      saveGuestWishlist(newList);
      Alert.alert('Removed', 'Product removed from wishlist');
      return;
    }

    try {
      await api.post('/api/wishlist/remove', { userId, productId });
      fetchWishlist();
      Alert.alert('Removed', 'Product removed from wishlist');
    } catch (err) {
      console.log('Remove wishlist error:', err);
    }
  };

  // Check if in wishlist
  const isInWishlist = (productId) => wishlist.includes(productId);

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  return (
    <WishlistContext.Provider value={{
      wishlist,
      loading,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      fetchWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
