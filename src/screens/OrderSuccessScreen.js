import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function OrderSuccessScreen({ route, navigation }) {
  const { orderNumber } = route.params;
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 💎 SUCCESS ICON SECTION */}
      <View style={styles.centerBox}>
        <Ionicons name="checkmark-circle" size={108} color="#111" style={{ opacity: 0.95 }} />
        <Text style={styles.title}>Order Placed</Text>
        <Text style={styles.subTitle}>
          Your order has been successfully placed.
        </Text>
        {orderNumber && (
          <Text style={styles.orderNumber}>Order #{orderNumber}</Text>
        )}
      </View>

      {/* 📦 VISUAL / HERO BANNER */}
      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: "https://images.pexels.com/photos/3839447/pexels-photo-3839447.jpeg" }} // replace with your brand banner later
          style={styles.bannerImage}
        />
      </View>

      {/* 📌 NEXT STEP ACTIONS */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate("Orders")}
        >
          <Text style={styles.primaryText}>Track Order</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate("Tabs")}
        >
          <Text style={styles.secondaryText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },

  /* ----- TOP CONTENT ----- */
  centerBox: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    marginTop: 14,
  },
  subTitle: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
    textAlign: "center",
    maxWidth: width * 0.75,
  },
  orderNumber: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "800",
  },

  /* ----- VISUAL HERO ----- */
  bannerContainer: {
    width: width,
    height: height * 0.28,
    overflow: "hidden",
    borderRadius: 0,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  /* ----- NEXT ACTIONS ----- */
  actionContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
    gap: 14,
  },

  primaryBtn: {
    backgroundColor: "#111",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },

  secondaryBtn: {
    borderWidth: 2,
    borderColor: "#111",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryText: {
    color: "#111",
    fontSize: 16,
    fontWeight: "800",
  },
});
