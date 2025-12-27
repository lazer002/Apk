// TabsNavigator.js
import React, { useEffect, useContext } from "react";
import { View, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ScreenWrapper from "../components/ScreenWrapper";
import { AuthContext } from "../context/AuthContext";

const Tabs = createBottomTabNavigator();

const EmptyScreen = () => <View style={{ flex: 1 }} />;

export default function TabsNavigator() {
  const { user } = useContext(AuthContext);

  /** shared value controls icon switching */
  const bundleIcon = useSharedValue(1);

  /** flip animation */
  const flip = useSharedValue(0);
  const flipAnim = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${flip.value}deg` }],
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      flip.value = withTiming(180, { duration: 200 }, () => {
        flip.value = 0;
        bundleIcon.value = bundleIcon.value ? 0 : 1;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleMiddlePress = (navigation) => {
    if (bundleIcon.value) {
      navigation.navigate("BundleListingScreen"); // bundle listing
    } else {
      navigation.navigate("ProductListingScreen"); // product listing (change if needed)
    }
  };

  const requireLogin = (navigation) => {
    Alert.alert("Login required", "Login to access your profile.", [
      { text: "Cancel", style: "cancel" },
      { text: "Login", onPress: () => navigation.navigate("Auth") },
    ]);
  };

  return (
    <Tabs.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,

        tabBarIcon: ({ focused }) => {
          /** MIDDLE SWITCH TAB ICON */
          if (route.name === "SwitchTab") {
            const icon = bundleIcon.value ? "cube-outline" : "shirt-outline";
            return (
              <TouchableOpacity onPress={() => handleMiddlePress(navigation)}>
                <Animated.View style={[styles.iconBox, flipAnim]}>
                  <Ionicons name={icon} size={32} color="black" />
                </Animated.View>
              </TouchableOpacity>
            );
          }

          /** NORMAL ICONS */
          const icons = {
            Home: focused ? "home" : "home-outline",
            Profile: focused ? "person" : "person-outline",
          };

          return (
            <View style={styles.iconBox}>
              <Ionicons name={icons[route.name]} size={32} color="black" />
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

      <Tabs.Screen name="SwitchTab">
        {() => <EmptyScreen />}
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

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: "6%",
    left: 20,
    right: 20,
    height: 70,
    borderRadius: 35,
    backgroundColor: "transparent",
    borderTopWidth: 0,
    elevation: 0,
  },
  iconBox: {
    backgroundColor: "white",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6,
  },
});
