// src/navigation/RootNavigator.js
import React, { useContext } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import SplashScreen from '../screens/SplashScreen';
import AuthScreen from '../screens/AuthScreen';
import OtpVerification from '../screens/OtpVerification';
import CheckoutScreen from '../screens/CheckoutScreen';
import SearchScreen from '../screens/SearchScreen';
import ProductScreen from '../screens/ProductScreen';
import BundleScreen from '../screens/BundleScreen'; // <- added
import CartScreen from '../screens/CartScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import ProductListingScreen from '../screens/ProductListingScreen';
import ScreenWrapper from '../components/ScreenWrapper';
import NotificationsScreen from '../screens/NotificationsScreen';
import { AuthContext } from '../context/AuthContext';
import BundlePLPScreen from '../screens/BundleListingScreen';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

/** Bottom tabs (Home, Search, Profile) **/
function TabsNavigator() {
  const { user } = useContext(AuthContext);

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
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused }) => {
          let iconName;
          let size = 32;
          let color = focused ? 'black' : 'black';

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Search':
              iconName = focused ? 'search' : 'search-outline';
              size = 48; // bigger middle icon
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return (
            <View
              style={[
                styles.iconContainer,
                route.name === 'Search' && styles.searchIconContainer,
              ]}
            >
              <Ionicons name={iconName} size={size} color={color} />
            </View>
          );
        },
      })}
    >
      <Tabs.Screen name="Home">
        {(props) => (
          <ScreenWrapper>
            <HomeScreen {...props} />
          </ScreenWrapper>
        )}
      </Tabs.Screen>

      {/* <Tabs.Screen name="Search">
        {(props) => (
          <ScreenWrapper>
            <SearchScreen {...props} />
          </ScreenWrapper>
        )}
      </Tabs.Screen> */}
            <Tabs.Screen name="bundlePLP">
        {(props) => (
          <ScreenWrapper>
            <BundlePLPScreen {...props} />
          </ScreenWrapper>
        )}
      </Tabs.Screen>

      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!user) {
              e.preventDefault();
              requireLogin(navigation);
            }
          },
        })}
      />
    </Tabs.Navigator>
  );
}

/** Root stack: wraps tabs + all other screens **/
export default function RootNavigator() {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Bottom tabs (home/search/profile) */}
      <Stack.Screen name="Tabs" component={TabsNavigator} />

      {/* Auth */}
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} />

      {/* Cart / favorites / checkout */}
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />

      {/* Product details */}
      <Stack.Screen name="ProductScreen">
        {(props) => (
          <ScreenWrapper>
            <ProductScreen {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>

      {/* Bundle details (added) */}
      <Stack.Screen name="BundleScreen">
        {(props) => (
          <ScreenWrapper>
            <BundleScreen {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>

      {/* Category flows (from home / anywhere) */}
      <Stack.Screen name="Categories">
        {(props) => (
          <ScreenWrapper>
            <CategoriesScreen {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>

      <Stack.Screen name="CategoryProducts">
        {(props) => (
          <ScreenWrapper>
            <ProductListingScreen {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: '6%',
    left: 20,
    right: 20,
    height: 70,
    borderRadius: 35,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    elevation: 0,
    borderTopColor: 'transparent',
  },
  iconContainer: {
    backgroundColor: 'white',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  searchIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});
