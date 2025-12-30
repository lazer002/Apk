// src/navigation/RootNavigator.js
import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import AuthScreen from '../screens/AuthScreen';
import OtpVerification from '../screens/OtpVerification';
import CheckoutScreen from '../screens/CheckoutScreen';
import SearchScreen from '../screens/SearchScreen';
import ProductScreen from '../screens/ProductScreen';
import BundleScreen from '../screens/BundleScreen';
import CartScreen from '../screens/CartScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import ProductCategoryScreen from '../screens/ProductCategoryScreen';
import ProductListingScreen from '../screens/ProductListingScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import BundleListingScreen from '../screens/BundleListingScreen';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';
import OrdersScreen from '../screens/OrdersScreen';
import TrackOrderScreen from '../screens/TrackOrderScreen';
import ReturnScreen from '../screens/ReturnScreen';

import TabsNavigator from './TabsNavigator';
import ScreenWrapper from '../components/ScreenWrapper';
import { AuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { loading } = useContext(AuthContext);

  if (loading) return <SplashScreen />;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {/* ⭐ Main Tabs */}
      <Stack.Screen name="Tabs" component={TabsNavigator} />

      {/* 🔐 Auth */}
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} />

      {/* 🛒 Core screens outside tabs */}
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />

      {/* 📌 Listing pages (VERY IMPORTANT to be here) */}
      <Stack.Screen name="BundleListingScreen" component={BundleListingScreen} />
      <Stack.Screen name="ProductListingScreen" component={ProductListingScreen} />
      <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
      <Stack.Screen name="TrackOrderScreen" component={TrackOrderScreen} />
      <Stack.Screen name="ReturnScreen" component={ReturnScreen} />
      

      {/* 🔎 Search */}
      <Stack.Screen name="SearchScreen" component={SearchScreen} />


      {/* 📦 Product detail wrappers */}
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

      {/* 🧭 Categories */}
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
  );
}
