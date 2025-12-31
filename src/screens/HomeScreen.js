// src/screens/HomeScreen.js
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  FlatList,
  Dimensions,
  StatusBar,
  ActivityIndicator
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import api from '../utils/config';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const { height, width } = Dimensions.get("window");
const HEADER_HEIGHT = 120;

// theme tokens
const PURPLE = `#C2B5DF`;
const ORANGE = `#F59E0B`;
const DARK = `#1A1A1A`;

export default function HomeScreen({ navigation }) {
  const { cartCount } = useCart();
  const [activeTab, setActiveTab] = useState("HOME");

  const [allProducts, setAllProducts] = useState([]);
  const [bundleProducts, setBundleProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingBundle, setLoadingBundle] = useState(false);

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const tabs = ["HOME", "MENS", "BUNDLE", "NEW"];

  const banners = [
    require('../assets/banner1.jpg'),
    require('../assets/banner2.jpg'),
    require('../assets/banner3.jpg'),
  ];

  // ---------------- FETCH -----------------
  useEffect(() => { fetchAllProducts(); }, []);
  useEffect(() => {
    if (activeTab === "BUNDLE" && bundleProducts.length === 0 && !loadingBundle) {
      fetchBundleProducts();
    }
  }, [activeTab]);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/products');
      setAllProducts(Array.isArray(res.data.items) ? res.data.items : []);
    } finally {
      setLoading(false);
    }
  };

  const fetchBundleProducts = async () => {
    try {
      setLoadingBundle(true);
      const res = await api.get('/api/bundles');
      setBundleProducts(Array.isArray(res.data.items) ? res.data.items : []);
    } finally {
      setLoadingBundle(false);
    }
  };

  // ---------------- HEADER -----------------
  const Header = () => (
    <View
      className="absolute top-0 left-0 right-0 z-50 rounded-b-3xl"
      style={{ backgroundColor: PURPLE, height: HEADER_HEIGHT }}
    >
      <StatusBar style="light" />

      {/* TOP RIGHT ICONS */}
      <View className="flex-row justify-end items-center px-6 pt-8 gap-6">
        <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
          <MaterialIcons name="notifications-none" size={25} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Favorites")}>
          <Ionicons name="heart-outline" size={25} color="white" />
        </TouchableOpacity>

        {/* CART */}
        <TouchableOpacity onPress={() => navigation.navigate("CartScreen")} className="relative">
          <Ionicons name="cart-outline" size={27} color="white" />
          {cartCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-[#F59E0B] px-1.5 rounded-full">
              <Text className="text-white text-[10px] font-bold">
                {cartCount > 99 ? '99+' : cartCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* TABS */}
      <View className="flex-row justify-between px-6 mt-4">
        {tabs.map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text
              className={`text-[16px] font-bold ${
                activeTab === tab ? "text-white" : "text-white/60"
              }`}
              style={activeTab === tab ? { borderBottomWidth: 2, borderColor: "white", paddingBottom: 6 } : {}}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // ---------------- PRODUCT CARD -----------------
  const ProductCard = ({ product }) => {
    const isFav = isInWishlist(product._id);

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('ProductScreen', { id: product._id })}
        className="w-[48%] mb-6"
      >
        <View className="glass-card p-4">

          {/* wishlist */}
          <TouchableOpacity
            onPress={() => isFav ? removeFromWishlist(product._id) : addToWishlist(product._id)}
            className="absolute top-4 right-4 bg-white/70 p-1.5 rounded-full"
          >
            <Ionicons
              name={isFav ? "heart" : "heart-outline"}
              size={18}
              color={isFav ? ORANGE : DARK}
            />
          </TouchableOpacity>

          {/* product image */}
          <Image
            source={{ uri: product.images?.[0] || "" }}
            className="w-full h-44 rounded-2xl mb-3"
            resizeMode="cover"
          />

          {/* product text */}
          <Text className="text-white font-semibold" numberOfLines={1}>
            {product.title}
          </Text>
          <Text className="text-[16px] font-bold mt-1" style={{ color: ORANGE }}>
            ₹{product.price}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // ---------------- HOME TAB -----------------
  const HomeTab = () => (
    <Animated.FlatList
      className="pt-[140px]"
      data={banners}
      keyExtractor={(_, i) => i.toString()}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <View className="px-4 pb-6">
          <Image
            source={item}
            resizeMode="cover"
            className="w-full h-[520px] rounded-3xl shadow-2xl"
          />
        </View>
      )}
      ListFooterComponent={<View className="h-48" />}
    />
  );

  // ---------------- MENS GRID -----------------
  const MensTab = () => (
    <FlatList
      className="pt-[140px] px-4"
      data={allProducts}
      numColumns={2}
      keyExtractor={(item) => item._id}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      contentContainerStyle={{ paddingBottom: 200 }}
      renderItem={({ item }) => <ProductCard product={item} />}
    />
  );

  return (
    <View className="flex-1" style={{     backgroundColor: "#181818",
    backgroundImage: "linear-gradient(180deg, #1A1A1A 0%, #111111 100%)" }}>
      <Header />

      {activeTab === "HOME" && <HomeTab />}
      {activeTab === "MENS" && <MensTab />}
      {activeTab === "BUNDLE" && <Text className="text-white pt-[160px] text-center">Bundle next</Text>}
      {activeTab === "NEW" && <Text className="text-white/60 pt-[160px] text-center">No new arrivals</Text>}

      {/* bottom fade */}
<LinearGradient
  colors={['transparent', DARK]}
  style={{
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 220,    // little bigger for smoother fade
  }}
/>

    </View>
  );
}
