import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Alert,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../utils/config';
import { Ionicons } from "@expo/vector-icons";
import HeroBanner from '../components/HeroBanner';
import {useWishlist}  from '../context/WishlistContext';
import { StatusBar } from 'expo-status-bar';
const { height, width } = Dimensions.get("window");

import b1 from "../assets/banner1.jpg";
import b2 from "../assets/banner2.jpg";
import b3 from "../assets/banner3.jpg";
export default function HomeScreen({ navigation }) {
const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('HOME');
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const homeBanners = [b1, b2, b3, b1, b2, b3, b1, b2, b3];
  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/products');
      const productsArray = Array.isArray(res.data.items) ? res.data.items : [];
      setProducts(productsArray);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/categories");
      const cats = Array.isArray(res.data.categories) ? res.data.categories : [];
      setCategories([{ _id: "HOME", name: "HOME" }, ...cats]);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([{ _id: "HOME", name: "HOME" }]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = products.filter((p) => {
    const categoryName = p.category?.name || "";
    return selectedCategory === "HOME" || categoryName.toLowerCase() === selectedCategory.toLowerCase();
  });


  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1F2937" />
      </View>
    );
  }

  return (
<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
<StatusBar barStyle="dark-content" />

      {/* 🔝 Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.topIcons}>
          <Ionicons name="notifications-outline" size={32} color="black" />
          <Ionicons name="heart-outline" size={32} color="black" />
          <Ionicons name="cart-outline" size={32} color="black" />
        </View>
      </View>

      {/* 🏷 Category Pills */}
      <View style={styles.categoryTabs}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryTab,
                selectedCategory === item.name && styles.categoryTabActive,
              ]}
              onPress={() => setSelectedCategory(item.name)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item.name && styles.categoryTextActive,
                ]}
              >
                {item.name.toUpperCase()}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* 🖼 Fullscreen Vertical Scrollable Feed for HOME */}
      {selectedCategory === "HOME" && (
        <FlatList
          data={homeBanners}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <Image source={item} style={styles.bannerImage} />
          )}
          pagingEnabled // snaps like swiper
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        />
      )}

      {/* 🛍 Product Grid for other categories */}
      {selectedCategory !== "HOME" && (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={styles.productList}
          renderItem={({ item }) => {
            const isFav = isInWishlist(item._id);
            return (
              <View style={styles.productCard}>
                <TouchableOpacity
                  onPress={() =>
                    isFav ? removeFromWishlist(item._id) : addToWishlist(item._id)
                  }
                  style={styles.wishlistButton}
                >
                  <Ionicons
                    name={isFav ? "heart" : "heart-outline"}
                    size={24}
                    color={isFav ? "#FF6347" : "black"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate("ProductScreen", { id: item._id })}
                >
                  <Image
                    source={{ uri: item.images?.[0] || "https://via.placeholder.com/150" }}
                    style={styles.productImage}
                  />
                  <View style={styles.productDetails}>
                    <Text style={styles.productName}>{item.title}</Text>
                    <Text style={styles.productPrice}>₹{item.price}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}

</SafeAreaView>


  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  // 🔝 Top Bar
  topBar: {
    position: "absolute",
    top: height*0.05,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  topIcons: { flexDirection: "row", gap: 35 },

  // 🏷 Category Tabs
  categoryTabs: {
    position: "absolute",
    top: height*0.12,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  categoryTab: { marginHorizontal: 22 },
  categoryText: { fontSize: 26, fontWeight: "600", color: "#555" },
  categoryTabActive: { borderBottomWidth: 2, borderColor: "#000" },
  categoryTextActive: { color: "#000" },

  // 🖼 Banner / Swiper
  bannerImage: {
    width: width,
    height: height,
    resizeMode: "cover",
  },

  // 🛍 Products
  productList: { paddingHorizontal: 8, paddingTop: 100, paddingBottom: 120 },
  productCard: {
    backgroundColor: "#fff",
    width: "48%",
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  productImage: { width: "100%", height: 180, resizeMode: "cover" },
  productDetails: { padding: 8 },
  productName: { fontSize: 14, fontWeight: "500", marginBottom: 4 },
  productPrice: { fontSize: 15, fontWeight: "700" },
  wishlistButton: { position: "absolute", top: 8, right: 8, zIndex: 10 },




});
