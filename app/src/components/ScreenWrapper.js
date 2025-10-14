// src/components/ScreenWrapper.js
import React from 'react';
import { View } from 'react-native';
import BackButton from './BackButton';
import GlobalCartIcon from './GlobalCartIcon';
import { useNavigationState } from '@react-navigation/native';

export default function ScreenWrapper({ children }) {
  const state = useNavigationState((state) => state);
  const routeName = state?.routes[state.index]?.name;

  const hideBack = ["HomeStackScreen", "Tabs", "Cart", "Favorites", "Profile", "Categories"].includes(routeName);
  const hideCart = ["HomeStackScreen", "Cart",  "Profile", "Categories"].includes(routeName);

  return (
    <View style={{ flex: 1 }}>
      {!hideBack && <BackButton />}
      {!hideCart && <GlobalCartIcon />}
      {children}
    </View>
  );
}
