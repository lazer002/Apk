import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import "./global.css";

import SplashScreen from './src/screens/SplashScreen';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import ProductScreen from './src/screens/ProductScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import OtpVerification from './src/screens/OtpVerification';
import CategoriesScreen from './src/screens/CategoriesScreen';

import { AuthProvider } from './src/context/AuthContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { CartProvider } from './src/context/CartContext';
import ScreenWrapper from './src/components/ScreenWrapper';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

// Home stack
function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home">
        {(props) => (
          <ScreenWrapper>
            <HomeScreen {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen name="Product">
        {(props) => (
          <ScreenWrapper>
            <ProductScreen {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

// Bottom tabs
function TabsNavigator() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#FF6347',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 70,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          switch (route.name) {
            case 'Home': iconName = focused ? 'home' : 'home-outline'; break;
            case 'Categories': iconName = focused ? 'grid' : 'grid-outline'; break;
            case 'Favorites': iconName = focused ? 'heart' : 'heart-outline'; break;
            case 'Cart': iconName = focused ? 'cart' : 'cart-outline'; break;
            case 'Profile': iconName = focused ? 'person' : 'person-outline'; break;
            default: iconName = 'ellipse-outline';
          }
          return <Ionicons name={iconName} size={26} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Home" component={HomeStackNavigator} />
      <Tabs.Screen name="Categories">
        {(props) => (
          <ScreenWrapper>
            <CategoriesScreen {...props} />
          </ScreenWrapper>
        )}
      </Tabs.Screen>
      <Tabs.Screen name="Favorites">
        {(props) => (
          <ScreenWrapper>
            <FavoritesScreen {...props} />
          </ScreenWrapper>
        )}
      </Tabs.Screen>
      <Tabs.Screen name="Cart">
        {(props) => (
          <ScreenWrapper>
            <CartScreen {...props} />
          </ScreenWrapper>
        )}
      </Tabs.Screen>
      <Tabs.Screen name="Profile">
        {(props) => (
          <ScreenWrapper>
            <ProfileScreen {...props} />
          </ScreenWrapper>
        )}
      </Tabs.Screen>
    </Tabs.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Tabs" component={TabsNavigator} />
              <Stack.Screen name="OtpVerification">
                {(props) => (
                  <ScreenWrapper>
                    <OtpVerification {...props} />
                  </ScreenWrapper>
                )}
              </Stack.Screen>
              <Stack.Screen name="Checkout">
                {(props) => (
                  <ScreenWrapper>
                    <CheckoutScreen {...props} />
                  </ScreenWrapper>
                )}
              </Stack.Screen>
            </Stack.Navigator>
          </NavigationContainer>
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}
