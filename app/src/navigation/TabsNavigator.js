// src/navigation/TabsNavigator.js
import React, { useContext } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeStackNavigator from './HomeStackNavigator';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { AuthContext } from '../context/AuthContext';

const Tabs = createBottomTabNavigator();

export default function TabsNavigator() {
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
          let size = 32; // default icon size
          let color = focused ? 'black' : 'black'; // active/inactive color

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
      <Tabs.Screen name="Home" component={HomeStackNavigator} />
      <Tabs.Screen name="Search" component={SearchScreen} />
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

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: '6%',
    left: 20,
    right: 20,
    height: 70, // reasonable height for tab bar
    borderRadius: 35,
    backgroundColor: 'transparent',
    elevation: 0,
    borderTopColor:"transparent"
  },
  iconContainer: {
    backgroundColor: 'white',
    width: 60,  // fixed width/height
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
