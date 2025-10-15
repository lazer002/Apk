// src/navigation/RootNavigator.js
import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import AuthScreen from '../screens/AuthScreen';
import OtpVerification from '../screens/OtpVerification';
import CheckoutScreen from '../screens/CheckoutScreen';
import TabsNavigator from './TabsNavigator';
import { AuthContext } from '../context/AuthContext';
import SearchScreen from '../screens/SearchScreen';
import ProductScreen from '../screens/ProductScreen';
import ScreenWrapper from '../components/ScreenWrapper';
import CartScreen from '../screens/CartScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { loading } = useContext(AuthContext);

  if (loading) return <SplashScreen />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabsNavigator} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} />
      <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
           <Stack.Screen name="Favorites" component={FavoritesScreen} />
  <Stack.Screen name="ProductScreen">
    {(props) => (
      <ScreenWrapper>
        <ProductScreen {...props} />
      </ScreenWrapper>
    )}
  </Stack.Screen>
    </Stack.Navigator>
  );
}
