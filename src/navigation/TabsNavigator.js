// src/navigation/TabsNavigator.js
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// ⭐ Reanimated
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

// ⭐ Haptics
import * as Haptics from "expo-haptics";

// ⭐ Blur
import { BlurView } from "expo-blur";

import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ScreenWrapper from "../components/ScreenWrapper";

const Tabs = createBottomTabNavigator();

export default function TabsNavigator() {
  const navigation = useNavigation();

  // 🧠 NEW: track last selected mode (cube/product)
  const [modeIcon, setModeIcon] = useState("cube-outline");

  // 🔁 animation values
  const flip = useSharedValue(0);
  const pulse = useSharedValue(1);
  const wingsOpen = useSharedValue(0);
  const wingLeft = useSharedValue(0);
  const wingRight = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);

  // 🎨 ICON CROSSFADE
  const iconOpacity = useSharedValue(1);
  const crossfadeAnim = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
  }));

  const fadeIconChange = (newIcon) => {
    iconOpacity.value = withTiming(0, { duration: 120 }, () => {
      runOnJS(setModeIcon)(newIcon);
      iconOpacity.value = withTiming(1, { duration: 120 });
    });
  };

  // 🎬 flip style
  const flipAnim = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${flip.value}deg` }],
  }));

  // 💗 pulse
  const pulseAnim = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const wingLeftAnim = useAnimatedStyle(() => ({
    opacity: wingsOpen.value,
    transform: [
      { translateX: wingLeft.value * wingsOpen.value },
      { translateY: -30 * wingsOpen.value },
    ],
  }));

  const wingRightAnim = useAnimatedStyle(() => ({
    opacity: wingsOpen.value,
    transform: [
      { translateX: wingRight.value * wingsOpen.value },
      { translateY: -30 * wingsOpen.value },
    ],
  }));

  const backdropAnim = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  // 💗 pulse loop
  const pulseLoop = () => {
    pulse.value = withTiming(1.08, { duration: 900 }, () => {
      pulse.value = withTiming(1, { duration: 900 }, () => {
        runOnJS(pulseLoop)();
      });
    });
  };
  useEffect(() => pulseLoop(), []);

  // 🔧 flip logic
  const runFlip = (callback) => {
    flip.value = withTiming(90, { duration: 130 }, () => {
      flip.value = withTiming(180, { duration: 130 }, () => {
        flip.value = 0;
        if (callback) runOnJS(callback)();
      });
    });
  };

  // 🪽 wings + backdrop
  const openWings = () => {
    wingsOpen.value = withSpring(1);
    wingLeft.value = withSpring(-80);
    wingRight.value = withSpring(80);
    backdropOpacity.value = withTiming(1, { duration: 200 });
  };

  const closeWings = () => {
    wingsOpen.value = withSpring(0);
    backdropOpacity.value = withTiming(0, { duration: 200 });
  };

  // 🎛 actions
// 🎯 single tap toggles destination & flips icon
const handleTap = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

  // if wings are open → close them instead
  if (wingsOpen.value === 1) {
    closeWings();
    return;
  }

  if (modeIcon === "shirt-outline") {
    // icon shows PRODUCT → go to product
    runFlip(() => {
      navigation.navigate("ProductListingScreen");
      fadeIconChange("cube-outline");  // prepare next navigation
    });
  } 
  else {
    // icon shows BUNDLE → go to bundle
    runFlip(() => {
      navigation.navigate("BundleListingScreen");
      fadeIconChange("shirt-outline"); // prepare next navigation
    });
  }
};


  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (wingsOpen.value === 0) {
      runFlip(openWings);
    } else {
      closeWings();
    }
  };

  return (
    <>
      {/* NORMAL TABS */}
      <Tabs.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tabs.Screen name="Home">
          {(props) => (
            <ScreenWrapper>
              <HomeScreen {...props} />
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

      {/* 🩶 BACKDROP BLUR */}
      <Animated.View
        pointerEvents={wingsOpen.value === 1 ? "auto" : "none"}
        style={[StyleSheet.absoluteFill, backdropAnim]}
      >
        <Pressable style={{ flex: 1 }} onPress={closeWings}>
          <BlurView intensity={50} tint="dark" style={{ flex: 1 }} />
        </Pressable>
      </Animated.View>

      {/* ⭐ FAB + WINGS */}
      <View style={styles.centerButtonContainer} pointerEvents="box-none">
        {/* LEFT */}
        <Animated.View style={[styles.miniButton, wingLeftAnim]}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              closeWings();
              fadeIconChange("cube-outline");
              navigation.navigate("BundleListingScreen");
            }}
          >
            <Ionicons name="cube" size={22} color="#000" />
          </TouchableOpacity>
        </Animated.View>

        {/* RIGHT */}
        <Animated.View style={[styles.miniButton, wingRightAnim]}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              closeWings();
              fadeIconChange("shirt-outline");
              navigation.navigate("ProductListingScreen");
            }}
          >
            <Ionicons name="shirt" size={22} color="#000" />
          </TouchableOpacity>
        </Animated.View>

        {/* MAIN */}
        <TouchableOpacity activeOpacity={1} onPress={handleTap} onLongPress={handleLongPress}>
          <Animated.View style={[styles.centerButton, pulseAnim, flipAnim]}>
            <Animated.View style={crossfadeAnim}>
              <Ionicons name={modeIcon} size={32} color="#000" />
            </Animated.View>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </>
  );
}

// ---------- STYLES ---------- //
const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: "6%",
    left: 20,
    right: 20,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    borderTopWidth: 0,
  },
  centerButtonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: "6%",
    alignItems: "center",
  },
  centerButton: {
    backgroundColor: "#fff",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 6,
  },
  miniButton: {
    position: "absolute",
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
    elevation: 5,
  },
});
