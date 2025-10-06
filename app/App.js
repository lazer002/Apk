import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import "./global.css";

import SplashScreen from './src/screens/SplashScreen';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import FavoritesScreen from './src/screens/FavoritesScreen'; // ✅ new screen
import ProductScreen from './src/screens/ProductScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import OtpVerification from './src/screens/OtpVerification';
import { AuthProvider } from './src/context/AuthContext';
import { FavoritesProvider } from './src/context/FavoritesContext';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function TabsNavigator() {
  return (
<Tabs.Navigator
  screenOptions={({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: '#FF6347',
    tabBarInactiveTintColor: 'gray',
    tabBarStyle: { paddingBottom: 5, height: 60, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;
      switch (route.name) {
        case 'Home':
          iconName = focused ? 'home' : 'home-outline';
          break;
        case 'Favorites':
          iconName = focused ? 'heart' : 'heart-outline';
          break;
        case 'Cart':
          iconName = focused ? 'cart' : 'cart-outline';
          break;
        case 'Profile':
          iconName = focused ? 'person' : 'person-outline';
          break;
      }
      return <Ionicons name={iconName} size={size} color={color} />;
    },
  })}
>
  <Tabs.Screen name="Home" component={HomeScreen} />
  <Tabs.Screen name="Favorites" component={FavoritesScreen} />
  <Tabs.Screen name="Cart" component={CartScreen} />
  <Tabs.Screen name="Profile" component={ProfileScreen} />
</Tabs.Navigator>

  );
}

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      {/* <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} /> 
         <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />  */}
          <Stack.Screen name="Tabs" component={TabsNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="OtpVerification" component={OtpVerification} options={{ headerShown: false }} />
          <Stack.Screen name="Product" component={ProductScreen} options={{ title: 'Product Details' }} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
        </Stack.Navigator>
      </NavigationContainer>
      </FavoritesProvider>
    </AuthProvider>
  );
}




         