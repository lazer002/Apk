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
import { Ionicons } from "@expo/vector-icons";
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
  const [modeIcon, setModeIcon] = useState("cube-outline");

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
      { translateY: -38 * wingsOpen.value },
    ],
  }));

  const wingRightAnim = useAnimatedStyle(() => ({
    opacity: wingsOpen.value,
    transform: [
      { translateX: wingRight.value * wingsOpen.value },
      { translateY: -38 * wingsOpen.value },
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

    if (modeIcon === "shirt-outline") {
      runFlip(() => {
        navigation.navigate("ProductListingScreen");
        fadeIconChange("cube-outline");
      });
    } else {
      runFlip(() => {
        navigation.navigate("BundleListingScreen");
        fadeIconChange("shirt-outline");
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
      {/* ===== YOUR EXISTING JSX BELOW IS UNCHANGED ===== */}

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

      <Animated.View
        pointerEvents={wingsOpen.value === 1 ? "auto" : "none"}
        style={[StyleSheet.absoluteFill, backdropAnim]}
      >
        <BlurView intensity={40} tint="dark" style={{ flex: 1 }} />
      </Animated.View>

      {/* FAB + Wings stay same */}
  <View style={styles.centerContainer} pointerEvents="box-none">

  {/* LEFT WING */}
  <Animated.View style={[styles.wing, wingLeftAnim]}>
    <TouchableOpacity
      onPress={() => {
        closeWings();
        fadeIconChange("cube-outline");
        navigation.navigate("BundleListingScreen");
      }}
    >
      <Ionicons name="cube" size={22} color="#000" />
    </TouchableOpacity>
  </Animated.View>

  {/* RIGHT WING */}
  <Animated.View style={[styles.wing, wingRightAnim]}>
    <TouchableOpacity
      onPress={() => {
        closeWings();
        fadeIconChange("shirt-outline");
        navigation.navigate("ProductListingScreen");
      }}
    >
      <Ionicons name="shirt" size={22} color="#000" />
    </TouchableOpacity>
  </Animated.View>

  {/* MAIN FAB */}
  <TouchableOpacity
    activeOpacity={1}
    onPress={handleTap}
    onLongPress={handleLongPress}
  >
    <Animated.View style={[styles.fab, pulseAnim, flipAnim]}>
      <Animated.View style={crossfadeAnim}>
        <Ionicons name={modeIcon} size={32} color="#000" />
      </Animated.View>
    </Animated.View>
  </TouchableOpacity>

</View>

    </View>
  </TouchableWithoutFeedback>
);


}

// ====== STYLES ====== //

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: "5%",
    left: 20,
    right: 20,
    height: 68,
    borderRadius: 30,
    backgroundColor: "#fff",
    borderTopWidth: 0,
    elevation: 6,
  },

  centerContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: "5%",
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
