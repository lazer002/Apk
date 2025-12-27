// src/navigation/RootNavigator.js
import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import SplashScreen from '../screens/SplashScreen';
import AuthScreen from '../screens/AuthScreen';
import OtpVerification from '../screens/OtpVerification';
import CheckoutScreen from '../screens/CheckoutScreen';
import SearchScreen from '../screens/SearchScreen';
import ProductScreen from '../screens/ProductScreen';
import BundleScreen from '../screens/BundleScreen';
import CartScreen from '../screens/CartScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import ProductCategoryScreen from '../screens/ProductCategoryScreen';
import ProductListingScreen from '../screens/ProductListingScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import BundleListingScreen from '../screens/BundleListingScreen';


import TabsNavigator from './TabsNavigator';
import ScreenWrapper from '../components/ScreenWrapper';
import { AuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { loading } = useContext(AuthContext);

  if (loading) return <SplashScreen />;

  return (
    <SafeAreaProvider>
      {/* ⭐ SafeAreaView applied here — all screens inside safe area */}
        <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* bottom tabs */}
          <Stack.Screen name="Tabs" component={TabsNavigator} />

          {/* auth */}
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="OtpVerification" component={OtpVerification} />

          {/* screens */}
          <Stack.Screen name="CartScreen" component={CartScreen} />
          <Stack.Screen name="Favorites" component={FavoritesScreen} />
          <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="BundleListingScreen" component={BundleListingScreen} />
          <Stack.Screen name="ProductListingScreen" component={ProductListingScreen} />


          <Stack.Screen name="ProductScreen">
            {props => (
              <ScreenWrapper>
                <ProductScreen {...props} />
              </ScreenWrapper>
            )}
          </Stack.Screen>

          <Stack.Screen name="BundleScreen">
            {props => (
              <ScreenWrapper>
                <BundleScreen {...props} />
              </ScreenWrapper>
            )}
          </Stack.Screen>

          <Stack.Screen name="Categories">
            {props => (
              <ScreenWrapper>
                <CategoriesScreen {...props} />
              </ScreenWrapper>
            )}
          </Stack.Screen>

          <Stack.Screen name="CategoryProducts">
            {props => (
              <ScreenWrapper>
                <ProductCategoryScreen {...props} />
              </ScreenWrapper>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
