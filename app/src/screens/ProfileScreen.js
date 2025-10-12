// src/screens/ProfileScreen.js
import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const navigation = useNavigation();

  // Dummy data
  const user = {
    name: "Ajit Kumar",
    email: "ajit@example.com",
    avatar: "https://i.pravatar.cc/150?img=12",
  };

  const addresses = [
    { id: 1, label: "Home", details: "123, ABC Street, Delhi" },
    { id: 2, label: "Work", details: "456, XYZ Road, Delhi" },
  ];

  const orders = [
    { id: 1, label: "Order #1001", date: "Oct 1, 2025", total: 2500 },
    { id: 2, label: "Order #1002", date: "Sep 28, 2025", total: 4500 },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* User Info */}
      <View style={styles.userCard}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("EditProfile")}
          style={styles.editBtn}
        >
          <Text style={{ color: "#fff" }}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Addresses */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Addresses</Text>
        {addresses.map((addr) => (
          <View key={addr.id} style={styles.addressCard}>
            <Text style={styles.addressLabel}>{addr.label}</Text>
            <Text style={styles.addressDetails}>{addr.details}</Text>
            <TouchableOpacity
              style={styles.editAddressBtn}
              onPress={() => navigation.navigate("EditAddress", { id: addr.id })}
            >
              <Text style={{ color: "#111", fontWeight: "bold" }}>Edit</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={styles.addAddressBtn}
          onPress={() => navigation.navigate("AddAddress")}
        >
          <Ionicons name="add-circle-outline" size={20} color="#111" />
          <Text style={{ marginLeft: 6 }}>Add New Address</Text>
        </TouchableOpacity>
      </View>

      {/* Orders */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Orders</Text>
        {orders.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={styles.orderCard}
            onPress={() => navigation.navigate("OrderDetails", { id: order.id })}
          >
            <Text style={styles.orderLabel}>{order.label}</Text>
            <Text style={styles.orderDate}>{order.date}</Text>
            <Text style={styles.orderTotal}>₹ {order.total.toLocaleString()}</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={() => {/* handle logout */}}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f2f2f2" },

  userCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: { width: 70, height: 70, borderRadius: 35 },
  userName: { fontSize: 18, fontWeight: "bold" },
  userEmail: { fontSize: 14, color: "#555" },
  editBtn: {
    backgroundColor: "#111",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },

  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },

  addressCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    position: "relative",
  },
  addressLabel: { fontWeight: "600", marginBottom: 4 },
  addressDetails: { color: "#555" },
  editAddressBtn: {
    position: "absolute",
    right: 12,
    top: 12,
    padding: 4,
  },
  addAddressBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  orderCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  orderLabel: { fontWeight: "600" },
  orderDate: { color: "#555" },
  orderTotal: { fontWeight: "bold" },

  logoutBtn: {
    backgroundColor: "#111",
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 32,
  },
});
