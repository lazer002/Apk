// src/navigation/TabsNavigator.js
import React, { useContext } from 'react';
import { Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeStackNavigator from './HomeStackNavigator';
import CategoriesScreen from '../screens/CategoriesScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { AuthContext } from '../context/AuthContext';

const Tabs = createBottomTabNavigator();

export default function TabsNavigator() {
  const { user } = useContext(AuthContext);

  // Centralized login check for tabs
  const requireLogin = (navigation) => {
    Alert.alert(
      'Login Required',
      'You need to login to access this feature.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => navigation.navigate('Auth') },
      ]
    );
  };

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
      <Tabs.Screen name="Categories" component={CategoriesScreen} />
      <Tabs.Screen name="Favorites" component={FavoritesScreen} />
      <Tabs.Screen name="Cart" component={CartScreen} />

      {/* Profile tab requires login */}
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        listeners={({ navigation }) => ({
          tabPress: e => {
            if (!user) {
              // Prevent default behavior
              e.preventDefault();
              requireLogin(navigation);
            }
          },
        })}
      />
    </Tabs.Navigator>
  );
}
