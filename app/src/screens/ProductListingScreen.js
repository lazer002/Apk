// src/screens/ProductListingScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../utils/config";
import { useWishlist } from "../context/WishlistContext";

const { width } = Dimensions.get("window");

export default function ProductListingScreen({ route, navigation }) {
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlist();
  const { category } = route.params;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & search
  const [searchText, setSearchText] = useState("");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortOption, setSortOption] = useState("newest"); // newest, priceLow, priceHigh

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/products?category=${category.name}`);
      setProducts(res.data.items || []);
    } catch (error) {
      console.error(error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  // Filtered products
  const filteredProducts = products
    .filter((p) =>
      p.title.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter((p) =>
      selectedSizes.length > 0
        ? p.sizes.some((size) => selectedSizes.includes(size))
        : true
    )
    .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
    .sort((a, b) => {
      if (sortOption === "priceLow") return a.price - b.price;
      if (sortOption === "priceHigh") return b.price - a.price;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  // Size selection toggle
  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Render Product Card
  const renderItem = ({ item }) => {
    const isFav = isInWishlist(item._id);

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("ProductScreen", { id: item._id })}
        style={styles.productCard}
      >
        <TouchableOpacity
          onPress={() =>
            isFav ? removeFromWishlist(item._id) : addToWishlist(item._id)
          }
          style={styles.wishlistButton}
        >
          <Ionicons
            name={isFav ? "heart" : "heart-outline"}
            size={20}
            color={isFav ? "#FF6347" : "black"}
          />
        </TouchableOpacity>

        <Image
          source={{ uri: item.images[0] || "https://via.placeholder.com/150" }}
          style={styles.productImage}
        />

        <View style={styles.productDetails}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ===== Search Bar ===== */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#555" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* ===== Filter Bar ===== */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
          <TouchableOpacity
            key={size}
            style={[
              styles.sizeButton,
              selectedSizes.includes(size) && styles.sizeButtonActive,
            ]}
            onPress={() => toggleSize(size)}
          >
            <Text
              style={
                selectedSizes.includes(size)
                  ? styles.sizeTextActive
                  : styles.sizeText
              }
            >
              {size}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ===== Product Grid ===== */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        numColumns={2}
        renderItem={renderItem}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 4 }}
        contentContainerStyle={styles.productsContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 8 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  searchInput: { flex: 1, marginLeft: 8, height: 40 },
  productsContainer: { paddingBottom: 120 },
  productCard: {
    flex: 1,
    marginHorizontal: 2,
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    height: 350,
    borderRadius: 8,
  },
  productImage: { width: "100%", height: "80%", resizeMode: "cover" },
  productDetails: { height: "20%", paddingHorizontal: 8, justifyContent: "center" },
  productName: { fontSize: 14, fontWeight: "500", color: "#1F2937" },
  productPrice: { fontSize: 15, fontWeight: "700", color: "#000" },
  wishlistButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 4,
    elevation: 2,
  },
  sizeButton: {
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  sizeButtonActive: { backgroundColor: "#1F2937", borderColor: "#1F2937" },
  sizeText: { color: "#1F2937" },
  sizeTextActive: { color: "#fff" },
});
