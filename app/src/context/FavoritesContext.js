import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem("favorites");
      if (stored) setFavorites(JSON.parse(stored));
    } catch (e) {
      console.log("Error loading favorites:", e);
    }
  };

  const saveFavorites = async (newList) => {
    try {
      await AsyncStorage.setItem("favorites", JSON.stringify(newList));
    } catch (e) {
      console.log("Error saving favorites:", e);
    }
  };

  const addFavorite = (product) => {
    const exists = favorites.find((p) => p.id === product.id);
    if (!exists) {
      const updated = [...favorites, product];
      setFavorites(updated);
      saveFavorites(updated);
    }
  };

  const removeFavorite = (productId) => {
    const updated = favorites.filter((p) => p.id !== productId);
    setFavorites(updated);
    saveFavorites(updated);
  };

  const isFavorite = (productId) => {
    return favorites.some((p) => p.id === productId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
