import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import  api  from '../utils/config';
import { Ionicons } from '@expo/vector-icons';
import { useWishlist } from '../context/WishlistContext';
import { StatusBar } from 'expo-status-bar';

const { height, width } = Dimensions.get('window');

import b1 from '../assets/banner1.jpg';
import b2 from '../assets/banner2.jpg';
import b3 from '../assets/banner3.jpg';

export default function HomeScreen({ navigation }) {
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('HOME');
  const [loading, setLoading] = useState(false);
  const homeBanners = [b1, b2, b3, b1, b2, b3, b1, b2, b3];
  
  const scrollYHome = useRef(new Animated.Value(0)).current;
  const scrollYCategory = useRef(new Animated.Value(0)).current;
  const scrollY = selectedCategory === "HOME" ? scrollYHome : scrollYCategory;
  const diffClampScrollY = Animated.diffClamp(scrollY, 0, 120);

  // Top bar / category translate
  const translateY = diffClampScrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, -160], // adjust as needed
    extrapolate: 'clamp',
  });

  // Top bar / category background fade
  const bgColor = diffClampScrollY.interpolate({
    inputRange: [0, 120],
    outputRange: ['rgba(255,255,255,1)', 'rgba(255,255,255,0)'],
    extrapolate: 'clamp',
  });

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

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories');
      const cats = Array.isArray(res.data.categories) ? res.data.categories : [];
      setCategories([{ _id: 'HOME', name: 'HOME' }, ...cats]);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([{ _id: 'HOME', name: 'HOME' }]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = products.filter((p) => {
    const categoryName = p.category?.name || '';
    return selectedCategory === 'HOME' || categoryName.toLowerCase() === selectedCategory.toLowerCase();
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

      {/* 🔝 Top Bar + Category Pills Animated */}
      <Animated.View
        style={[
          styles.topBarContainer,
          { transform: [{ translateY }] }
        ]}
      >
        {/* Background fade */}
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: bgColor, zIndex: -1 }]}
          pointerEvents="none"
        />

        {/* Top Bar icons */}
        <View style={styles.topBar}>
          <View style={styles.topIcons}>
            <Ionicons name="notifications-outline" size={32} color="black" />
            <Ionicons name="heart-outline" size={32} color="black" />
            <Ionicons name="cart-outline" size={32} color="black" />
          </View>
        </View>

        {/* Category Pills */}
        <View style={styles.categoryTabs}>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.categoryTab, selectedCategory === item.name && styles.categoryTabActive]}
                onPress={() => setSelectedCategory(item.name)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === item.name && styles.categoryTextActive
                  ]}
                >
                  {item.name.toUpperCase()}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Animated.View>

      {/* 🖼 Home Screen Banners */}
      {selectedCategory === 'HOME' && (
        <Animated.FlatList
          data={homeBanners}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <Image source={item} style={styles.bannerImage} />}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          // contentContainerStyle={{ paddingTop: height * 0.18 }} // top bar + category height
        />
      )}

      {/* 🛍 Product Grid */}
      {selectedCategory !== 'HOME' && (
        <Animated.FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          // contentContainerStyle={{ ...styles.productList, paddingTop: height * 0.18 }}
          contentContainerStyle={{ ...styles.productList }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          renderItem={({ item }) => {
            const isFav = isInWishlist(item._id);
            return (
              <View style={styles.productCard}>
                <TouchableOpacity
                  onPress={() => (isFav ? removeFromWishlist(item._id) : addToWishlist(item._id))}
                  style={styles.wishlistButton}
                >
                  <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={24} color={isFav ? '#FF6347' : 'black'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ProductScreen', { id: item._id })}>
                  <Image
                    source={{ uri: item.images?.[0] || 'https://via.placeholder.com/150' }}
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
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  topBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: width * 0.04, // 4% of screen width
    paddingTop: height * 0.06, // 6% of screen height
  },
  topIcons: { flexDirection: 'row', gap: width * 0.09 }, // spacing between icons

  categoryTabs: {
    marginTop: height * 0.02, // 2% of screen height
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.02,
  },
  categoryTab: { marginHorizontal: width * 0.05 },
  categoryText: { fontSize: width * 0.07, fontWeight: '600', color: '#555' }, // font scales with width
  categoryTabActive: { borderBottomWidth: 2, borderColor: '#000' },
  categoryTextActive: { color: '#000' },

  bannerImage: { width: width, height: height, resizeMode: 'cover' },

  productList: { paddingHorizontal: width * 0.02, paddingTop: height * 0.15, paddingBottom: height * 0.15 },
  productCard: {
    backgroundColor: '#fff',
    width: '48%',
    borderRadius: width * 0.02,
    marginBottom: height * 0.015,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  productImage: { width: '100%', height: height * 0.38, resizeMode: 'cover' }, // height scales
  productDetails: { padding: width * 0.02 },
  productName: { fontSize: width * 0.035, fontWeight: '500', marginBottom: height * 0.005 },
  productPrice: { fontSize: width * 0.04, fontWeight: '700' },
  wishlistButton: { position: 'absolute', top: height * 0.012, right: width * 0.02, zIndex: 10 },
});

