// src/screens/CartScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Dimensions,
  useColorScheme
} from "react-native";
import { useCart } from "../context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from '../context/AuthContext';
const { width } = Dimensions.get("window");
import { SafeAreaView } from 'react-native-safe-area-context';
export default function CartScreen() {
    const { user } = useAuth();
    const theme = useColorScheme();
  const isDark = theme === 'dark';
  const navigation = useNavigation();
  const { items, update, remove } = useCart();
  const [coupon, setCoupon] = useState("");

  const subtotal = items.reduce(
    (s, it) => s + (it.product?.price || 0) * it.quantity,
    0
  );
  const tax = subtotal * 0.05;
  const deliveryFee = subtotal > 500 ? 0 : 50;
  const discount = 0;
  const total = subtotal + tax + deliveryFee - discount;

  if (items.length === 0)
    return (
<View
      style={[
        styles.emptyContainer,
        { backgroundColor: isDark ? '#000' : '#fff' },
      ]}
    >
      {/* ❤️ Wishlist Icon (top-right corner) */}
      <TouchableOpacity
        style={styles.wishlistIcon}
        onPress={() => navigation.navigate('Favorites')}
      >
        <Ionicons
          name="heart-outline"
          size={28}
          color={isDark ? 'black' : '#111'}
        />
      </TouchableOpacity>

      {/* 🛍️ Empty Bag Icon */}
      <View
        style={[
          styles.iconWrapper,
          { backgroundColor: isDark ? '#111' : '#f2f2f2' },
        ]}
      >
        <Ionicons
          name="bag-outline"
          size={90}
          color={isDark ? 'black' : '#111'}
        />
      </View>

      {/* 📝 Headings */}
      <Text style={[styles.emptyTitle, { color: isDark ? '#fff' : '#000' }]}>
        YOUR BAG IS EMPTY
      </Text>

      <Text style={[styles.emptySubtitle, { color: isDark ? '#aaa' : '#666' }]}>
        Your cart is ready to roll, but it's feeling a bit empty without some
        stylish finds.
      </Text>

      {/* Buttons */}
      <View style={styles.emptyButtons}>
        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.btnPrimaryText}>SHOP NOW</Text>
        </TouchableOpacity>
      </View>
    </View>
    );

  return (
    <SafeAreaView>
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cart Items */}
      <View style={styles.itemsContainer}>
        {items.map((it) => (
          <View key={it.product._id} style={styles.itemCard}>
            <Image
              source={{ uri: it.product.images?.[0] }}
              style={styles.itemImage}
            />
            <View style={styles.itemInfo}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {it.product.title}
                </Text>
                <TouchableOpacity onPress={() => remove(it.product._id,it.size)}>
                  <Ionicons
                    name="close"
                    size={20}
                    color="#999"
                    style={{ marginLeft: 8 }}
                  />
                </TouchableOpacity>
              </View>

              {/* Variants */}
              <View style={styles.variants}>
                {it.size && (
                  <Text style={styles.variant}>Size: {it.size}</Text>
                )}
                {it.selectedColor && (
                  <Text style={styles.variant}>
                    Color: {it.selectedColor}
                  </Text>
                )}
              </View>

              {/* Quantity */}
              <View style={styles.qtyContainer}>
                <Text style={{ fontWeight: "500" }}>Qty:</Text>
                <View style={styles.qtyControls}>
                  <TouchableOpacity
                    onPress={() => {
                      if (it.quantity === 1) remove(it.product._id,it.size);
                      else update(it.product._id, it.quantity - 1,it.size);
                    }}
                    style={styles.qtyBtn}
                  >
                    <Text style={styles.qtyBtnText}>-</Text>
                  </TouchableOpacity>
                  <TextInput
                    value={it.quantity.toString()}
                    keyboardType="number-pad"
                    onChangeText={(val) =>
                      update(it.product._id, Number(val),it.size)
                    }
                    style={styles.qtyInput}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      update(it.product._id, it.quantity + 1,it.size)
                    }
                    style={styles.qtyBtn}
                  >
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Price */}
              <Text style={styles.itemPrice}>
                ₹ {(it.product.price * it.quantity).toLocaleString()}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Order Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text>Subtotal</Text>
          <Text>₹ {subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Tax (5%)</Text>
          <Text>₹ {tax.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Delivery Fee</Text>
          <Text>₹ {deliveryFee.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Discount</Text>
          <Text>₹ {discount.toFixed(2)}</Text>
        </View>

        <View style={[styles.summaryRow, { borderTopWidth: 1, marginTop: 8, paddingTop: 8 }]}>
          <Text style={{ fontWeight: "bold" }}>Total</Text>
          <Text style={{ fontWeight: "bold" }}>₹ {total.toFixed(2)}</Text>
        </View>

        {/* Coupon */}
        <View style={styles.couponContainer}>
          <TextInput
            placeholder="Enter coupon code"
            value={coupon}
            onChangeText={setCoupon}
            style={styles.couponInput}
          />
          <TouchableOpacity style={styles.couponBtn}>
            <Text style={{ color: "#fff" }}>Apply</Text>
          </TouchableOpacity>
        </View>

        {/* Checkout */}
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate("Checkout")}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Proceed to Checkout
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f2f2f2" },
emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  wishlistIcon: {
    position: 'absolute',
    top: 50,
    right: 30,
    zIndex: 10,
    padding: 8,
  },
  iconWrapper: {
    width: 150,
    height: 150,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    width: '85%',
  },
  emptyButtons: {
    gap: 10,
    alignItems: 'center',
    width: '100%',
  },
  btn: {
    width: '80%',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: '#111',
  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  itemsContainer: { marginBottom: 20 },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  itemImage: { width: 90, height: 90, borderRadius: 12 },
  itemInfo: { flex: 1, marginLeft: 12, justifyContent: "space-between" },
  itemHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemTitle: { fontWeight: "600", fontSize: 16, maxWidth: width - 180 },
  variants: { flexDirection: "row", gap: 6, marginTop: 6, flexWrap: "wrap" },
  variant: { borderWidth: 1, borderColor: "#ccc", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, fontSize: 12 },
  qtyContainer: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  qtyControls: { flexDirection: "row", borderWidth: 1, borderColor: "#ccc", borderRadius: 6, overflow: "hidden", marginLeft: 8 },
  qtyBtn: { paddingHorizontal: 12, justifyContent: "center", alignItems: "center" },
  qtyBtnText: { fontWeight: "bold", fontSize: 16 },
  qtyInput: { width: 40, textAlign: "center", borderLeftWidth: 1, borderRightWidth: 1, borderColor: "#ccc" },
  itemPrice: { marginTop: 8, fontWeight: "bold", color: "#042354" },

  summaryContainer: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 20 },
  summaryTitle: { fontWeight: "bold", fontSize: 18, marginBottom: 12 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 4 },
  couponContainer: { flexDirection: "row", marginTop: 12 },
  couponInput: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 6, paddingHorizontal: 12 },
  couponBtn: { backgroundColor: "#111", paddingHorizontal: 16, justifyContent: "center", alignItems: "center", borderRadius: 6, marginLeft: 8 },
  checkoutBtn: { backgroundColor: "#111", paddingVertical: 14, justifyContent: "center", alignItems: "center", borderRadius: 8, marginTop: 16 },
});
