// src/navigation/TabsNavigator.js
import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Platform,
  TouchableWithoutFeedback
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Package,
  Shirt,
  House,
  Search,
  Heart,
  User2,
} from "lucide-react-native";

import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ScreenWrapper from "../components/ScreenWrapper";

const Tabs = createBottomTabNavigator();

export default function TabsNavigator() {
  const navigation = useNavigation();

  // current icon showing NEXT page user will go after tap
  const [modeIcon, setModeIcon] = useState("shirt");

  // animations
  const flip = useSharedValue(0);
  const pulse = useSharedValue(1);
  const wingsOpen = useSharedValue(0);
  const wingLeft = useSharedValue(0);
  const wingRight = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);
  const iconOpacity = useSharedValue(1);

  // ====== ANIMATED STYLES ====== //

  const flipAnim = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${flip.value}deg` }],
  }));

  const pulseAnim = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const crossfadeAnim = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
  }));

  const wingLeftAnim = useAnimatedStyle(() => ({
    opacity: wingsOpen.value,
    transform: [
      { translateX: wingLeft.value * wingsOpen.value },
      { translateY: -58 * wingsOpen.value },
    ],
  }));

  const wingRightAnim = useAnimatedStyle(() => ({
    opacity: wingsOpen.value,
    transform: [
      { translateX: wingRight.value * wingsOpen.value },
      { translateY: -58 * wingsOpen.value },
    ],
  }));

  const backdropAnim = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  // ====== EFFECTS ====== //

  const pulseLoop = () => {
    pulse.value = withTiming(1.08, { duration: 900 }, () => {
      pulse.value = withTiming(1, { duration: 900 }, () => {
        runOnJS(pulseLoop)();
      });
    });
  };
  useEffect(() => pulseLoop(), []);

  // ====== HELPERS ====== //

  const fadeIconChange = (newIcon) => {
    iconOpacity.value = withTiming(0, { duration: 120 }, () => {
      runOnJS(setModeIcon)(newIcon);
      iconOpacity.value = withTiming(1, { duration: 120 });
    });
  };

  const runFlip = (cb) => {
    flip.value = withTiming(90, { duration: 130 }, () => {
      flip.value = withTiming(180, { duration: 130 }, () => {
        flip.value = 0;
        if (cb) runOnJS(cb)();
      });
    });
  };

  const openWings = () => {
    wingsOpen.value = withSpring(1);
    wingLeft.value = withSpring(-82);
    wingRight.value = withSpring(82);
    backdropOpacity.value = withTiming(1, { duration: 200 });
  };

  const closeWings = () => {
    wingsOpen.value = withSpring(0);
    backdropOpacity.value = withTiming(0, { duration: 200 });
  };

  // ====== USER INTERACTION ====== //

  // short tap → toggle screens
  const handleTap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (wingsOpen.value === 1) {
      closeWings();
      return;
    }

    if (modeIcon === "shirt") {
      runFlip(() => {
        navigation.navigate("ProductListingScreen");
        fadeIconChange("package"); // switch to package icon
      });
    } else {
      runFlip(() => {
        navigation.navigate("BundleListingScreen");
        fadeIconChange("shirt"); // switch back to shirt icon
      });
    }
  };

  // long press → wings
  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (wingsOpen.value === 0) {
      runFlip(openWings);
    } else {
      closeWings();
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={(e) => {
        // if wings closed → do nothing
        if (wingsOpen.value === 0) return;

        // get tap location
        const { locationX, locationY } = e.nativeEvent;

        // detect tap inside FAB area (do NOT close wings)
        if (locationY > 520 && locationY < 620 && locationX > 140 && locationX < 260) {
          return;
        }

        // detect tap inside left wing area
        if (locationY > 470 && locationY < 570 && locationX > 90 && locationX < 170) {
          return;
        }

        // detect tap inside right wing area
        if (locationY > 470 && locationY < 570 && locationX > 230 && locationX < 310) {
          return;
        }

        // otherwise → close wings
        closeWings();
      }}
    >
      <View style={{ flex: 1 }}>

        <Tabs.Navigator
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: styles.tabBar,
          }}
        >
          <Tabs.Screen
            name="Home"
            options={{
              tabBarIcon: ({ focused }) => (
                <House
                  size={24}
                  strokeWidth={focused ? 3 : 2}
                  color={focused ? "#000" : "#777"}
                />
              ),
            }}
          >
            {(props) => (
              <ScreenWrapper>
                <HomeScreen {...props} />
              </ScreenWrapper>
            )}
          </Tabs.Screen>

          <Tabs.Screen
            name="ProfileScreen"
            options={{
              tabBarIcon: ({ focused }) => (
                <User2
                  size={24}
                  strokeWidth={focused ? 3 : 2}
                  color={focused ? "#000" : "#777"}
                />
              ),
            }}
          >
            {(props) => (
              <ScreenWrapper>
                <ProfileScreen {...props} />
              </ScreenWrapper>
            )}
          </Tabs.Screen>

        </Tabs.Navigator>
        <View
          style={{
            position: "absolute",
            bottom: "5%",
            left: 0,
            right: 0,
            alignItems: "center",
            pointerEvents: "box-none",
          }}
        >
          {/* main glass bar background */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 25,
              paddingVertical: 14,
              width: "78%",
              borderRadius: 40,
              backgroundColor: "rgba(255,255,255,0.12)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(14px)",     // web
              backdropBlurRadius: 14,           // native
            }}
          >
            {/* --- HOME white circle button --- */}
            <TouchableOpacity onPress={() => navigation.navigate("Tabs", { screen: "Home" })}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: "#FFFFFF",
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.06)",
                }}
              >
                <House size={26} strokeWidth={2.6} color="#000" />
              </View>
            </TouchableOpacity>

            {/* placeholder to keep gap for FAB */}
            <View style={{ width: 50 }} />

            {/* --- PROFILE white circle button --- */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Tabs", { screen: "ProfileScreen" })}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: "#FFFFFF",
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.06)",
                }}
              >
                <User2 size={26} strokeWidth={2.6} color="#000" />
              </View>
            </TouchableOpacity>
          </View>

          {/* --- lifted FAB --- */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleTap}
            onLongPress={handleLongPress}
            style={{
              position: "absolute",
              top: -42,          // <— lifted look
            }}
          >
            <Animated.View style={[styles.fab, pulseAnim, flipAnim]}>
              <Animated.View style={crossfadeAnim}>
                {modeIcon === "package" ? (
                  <Package size={28} strokeWidth={2.6} color="#000" />
                ) : (
                  <Shirt size={28} strokeWidth={2.6} color="#000" />
                )}
              </Animated.View>
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* FAB + Wings stay same */}
        <View style={styles.centerContainer} pointerEvents="box-none">

          {/* LEFT WING */}
          <Animated.View style={[styles.wing, wingLeftAnim]}>
            <TouchableOpacity
              onPress={() => {
                closeWings();
                fadeIconChange("package"); // fixed
                navigation.navigate("BundleListingScreen");
              }}
            >
              <Package size={26} strokeWidth={2.4} color="#000" />
            </TouchableOpacity>
          </Animated.View>

          {/* RIGHT WING */}
          <Animated.View style={[styles.wing, wingRightAnim]}>
            <TouchableOpacity
              onPress={() => {
                closeWings();
                fadeIconChange("shirt"); // fixed
                navigation.navigate("ProductListingScreen");
              }}
            >
              <Shirt size={26} strokeWidth={2.4} color="#000" />
            </TouchableOpacity>
          </Animated.View>


        </View>

      </View>
    </TouchableWithoutFeedback>
  );


}

// ====== STYLES ====== //

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: "15%",
    left: 20,
    right: 20,
    height: 68,
    borderRadius: 30,
    backgroundColor: "transparent",
    borderTopWidth: 0,
    elevation: 6,
    opacity: 0, // hide default tab bar
  },

  centerContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: "15%",
    alignItems: "center",
  },

  fab: {
    backgroundColor: "#fff",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.20,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 9,
  },

  wing: {
    position: "absolute",
    bottom: "35%",
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",

    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 6,
  },
});
