// src/context/CartContext.js
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import { user } from './AuthContext';

const CartContext = createContext(null);
const API_URL = 'http://localhost:4000/api'; // replace with your API

function ensureGuestId() {
  let gid = globalThis.guestId; // you can persist in AsyncStorage if needed
  if (!gid) {
    gid = Math.random().toString(36).substring(2, 15); // simple UUID
    globalThis.guestId = gid;
  }
  return gid;
}

export function CartProvider({ children }) {

  const [items, setItems] = useState([]);
  const guestId = ensureGuestId();

  const client = useMemo(() => axios.create({
    baseURL: `${API_URL}/cart`,
    headers: { 'x-guest-id': guestId }
  }), [guestId]);

  const refresh = async () => {
    try {
      const { data } = await client.get('/');
      setItems(data.items);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to refresh cart");
    }
  };

  // Fetch cart on load
  useEffect(() => { refresh(); }, []);

  // Merge guest cart after login
  const mergeGuestCart = async () => {
    if (!user) return;

    try {
      await axios.post(`${API_URL}/cart/merge`, { guestId }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      await refresh();
      Alert.alert("Success", "Guest cart merged successfully");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to merge guest cart");
    }
  };

  useEffect(() => {
    if (user) mergeGuestCart();
  }, [user]);

  // Optimistic updates
  const add = async (productId, size, quantity = 1) => {
    if (!size) {
      Alert.alert("Select Size", "Please select a size!");
      return;
    }

    const existing = items.find(i => i.product._id === productId && i.size === size);

    if (existing) {
      setItems(prev =>
        prev.map(i =>
          i.product._id === productId && i.size === size
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      );
    } else {
      setItems(prev => [...prev, { product: { _id: productId }, size, quantity }]);
    }

    try {
      await client.post('/add', { productId, size, quantity });
      await refresh();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to add item");
      refresh();
    }
  };

  const update = async (productId, quantity) => {
    setItems(prev => prev.map(i => i.product._id === productId ? { ...i, quantity } : i));
    try {
      await client.post('/update', { productId, quantity });
      await refresh();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update cart");
      refresh();
    }
  };

  const remove = async (productId) => {
    setItems(prev => prev.filter(i => i.product._id !== productId));
    try {
      await client.post('/remove', { productId });
      await refresh();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to remove item");
      refresh();
    }
  };

  const getCartCount = () => items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, add, update, remove, refresh, mergeGuestCart, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
