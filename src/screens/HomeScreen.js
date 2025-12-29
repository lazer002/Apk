// src/screens/HomeScreen.js
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
  ActivityIndicator
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import api from '../utils/config';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
const screenWidth = Dimensions.get("window").width;

// ⭐ FIXED TOP BAR — do not change
const STATUS_BAR_OFFSET = 0;
const TOPBAR_HEIGHT = 50;
const TABS_HEIGHT = 50;
const HEADER_TOTAL_HEIGHT = STATUS_BAR_OFFSET + TOPBAR_HEIGHT + TABS_HEIGHT;
const { height, width } = Dimensions.get('window');

import b1 from '../assets/banner1.jpg';
import b2 from '../assets/banner2.jpg';
import b3 from '../assets/banner3.jpg';
export default function HomeScreen({ navigation }) {
  const { cartCount } = useCart();
  const [activeTab, setActiveTab] = useState("HOME");
  const [allProducts, setAllProducts] = useState([]);
  const [bundleProducts, setBundleProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingBundle, setLoadingBundle] = useState(false);

  const tabs = ["HOME", "MENS", "BUNDLE", "NEW"];
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const homeBanners = [b1, b2, b3, b1, b2, b3, b1, b2, b3];
  const scrollYHome = useRef(new Animated.Value(0)).current;
  const scrollYProducts = useRef(new Animated.Value(0)).current;

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/products');
      const productsArray = Array.isArray(res.data.items) ? res.data.items : [];
      setAllProducts(productsArray);
    } catch (error) {
      console.error('Error fetching products:', error);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };
  const fetchBundleProducts = async () => {
    try {
      setLoadingBundle(true);
      // adjust endpoint/shape if your backend is different
      const res = await api.get('/api/bundles');
      const items = Array.isArray(res.data.items) ? res.data.items : [];
      console.log('Fetched bundle products:', items);
      setBundleProducts(items);
    } catch (error) {
      console.error('Error fetching bundle products:', error);
      setBundleProducts([]);
    } finally {
      setLoadingBundle(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (activeTab === "BUNDLE" && bundleProducts.length === 0 && !loadingBundle) {
      fetchBundleProducts();
    }
  }, [activeTab]);

  if (loading && allProducts.length === 0) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1F2937" />
      </View>
    );
  }
  // ⭐ MENS TAB (restored to your UI layout)
  const renderMensProducts = () => (
    <Animated.FlatList
      nestedScrollEnabled
      data={allProducts}
      keyExtractor={(product) => product._id}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      contentContainerStyle={styles.productList}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollYProducts } } }],
        { useNativeDriver: false }
      )}
      scrollEventThrottle={16}
      renderItem={({ item: product }) => {
        const isFav = isInWishlist(product._id);
        return (
          <View style={styles.productCard}>
            <TouchableOpacity
              onPress={() =>
                isFav
                  ? removeFromWishlist(product._id)
                  : addToWishlist(product._id)
              }
              style={styles.wishlistButton}
            >
              <Ionicons
                name={isFav ? 'heart-sharp' : 'heart-outline'}
                size={24}
                color={isFav ? 'black' : 'black'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ProductScreen', { id: product._id })
              }
            >
              <Image
                source={{
                  uri:
                    product.images?.[0] ||
                    'https://via.placeholder.com/150',
                }}
                style={styles.productImage}
              />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{product.title}</Text>
                <Text style={styles.productPrice}>₹{product.price}</Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      }}
    />
  );

  // ⭐ HOME TAB (banner + your grid)
  const renderHomeProducts = () => (
    <Animated.FlatList
      nestedScrollEnabled
      data={homeBanners}
      keyExtractor={(_, i) => i.toString()}
      style={{ height }}                    // viewport = screen height
      renderItem={({ item: banner }) => (
        <Image
          source={banner}
          style={{ width, height }}         // each item = full screen
          resizeMode="cover"
        />
      )}
      pagingEnabled
      snapToInterval={height}               // snap exactly 1 screen
      decelerationRate="fast"
      snapToAlignment="start"
      showsVerticalScrollIndicator={false}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollYHome } } }],
        { useNativeDriver: false }
      )}
      scrollEventThrottle={16}
      contentContainerStyle={{
        // no top/bottom padding for perfect paging
      }}
      getItemLayout={(_, index) => ({
        length: height,
        offset: height * index,
        index,
      })}
    />
  );

  // ⭐ BUNDLE TAB (your old UI look)
  const renderBundles = () => (
    loadingBundle && bundleProducts.length === 0 ? (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1F2937" />
      </View>
    ) : (
      <Animated.FlatList
        nestedScrollEnabled
        data={bundleProducts}
        keyExtractor={(bundle) => bundle._id}
        // one card per row – bundles feel better full-width
        numColumns={1}
        contentContainerStyle={styles.bundleList}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollYProducts } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No bundles yet.</Text>
          </View>
        }
        renderItem={({ item: bundle }) => {
          const firstImage =
            bundle.mainImages?.[0] ??
            bundle.products?.[0]?.images?.[0] ??
            'https://via.placeholder.com/300';

          const itemsCount = bundle.products?.length || 0;

          return (
            <View style={styles.bundleCard}>
              <TouchableOpacity
                // TODO: replace "BundleScreen" with your actual bundle details route
                onPress={() =>
                  navigation.navigate('BundleScreen', { id: bundle._id })
                }
              >
                <Image
                  source={{ uri: firstImage }}
                  style={styles.bundleMainImage}
                />

                <View style={styles.bundleContent}>
                  <View style={styles.bundleHeaderRow}>
                    <Text style={styles.bundleTitle}>{bundle.title}</Text>
                    <Text style={styles.bundlePrice}>₹{bundle.price}</Text>
                  </View>

                  {!!bundle.description && (
                    <Text
                      style={styles.bundleDescription}
                      numberOfLines={2}
                    >
                      {bundle.description}
                    </Text>
                  )}

                  <Text style={styles.bundleItemsInfo}>
                    {itemsCount} item{itemsCount !== 1 ? 's' : ''} in this bundle
                  </Text>

                  {/* Row of included products thumbnails */}
                  <View style={styles.bundleProductsRow}>
                    {bundle.products?.slice(0, 3).map((prod) => (
                      <View key={prod._id} style={styles.bundleProductThumbWrapper}>
                        <Image
                          source={{
                            uri:
                              prod.images?.[0] ||
                              'https://via.placeholder.com/80',
                          }}
                          style={styles.bundleProductThumb}
                        />
                      </View>
                    ))}

                    {itemsCount > 3 && (
                      <Text style={styles.bundleMoreText}>
                        +{itemsCount - 3} more
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    )
  );

  // ⭐ NEW TAB placeholder unchanged
  const renderNew = () => (
    <View style={[styles.emptyState, { paddingTop: HEADER_TOTAL_HEIGHT + 40 }]}>
      <Text style={styles.emptyText}>No new arrivals 🚫</Text>
    </View>
  );
  return (
    
    <View style={styles.container}>
      {/* ⭐ YOUR TOPBAR — unchanged */}
      <View style={styles.headerWrapper}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
            <MaterialIcons name="notifications-none" size={26} color="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Favorites")}>
            <Ionicons name="heart-outline" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("CartScreen")}>
            <Ionicons name="cart-outline" size={26} color="black" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartCount > 99 ? '99+' : cartCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* ⭐ TABS — unchanged UI */}
        <View style={styles.tabsRow}>
          {tabs.map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.activeTab]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ⭐ CONTENT — now with your UI restored */}
      {activeTab === "HOME" && renderHomeProducts()}
      {activeTab === "MENS" && renderMensProducts()}
      {activeTab === "BUNDLE" && renderBundles()}
      {activeTab === "NEW" && renderNew()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff" },

  headerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "white",
  },

  topBar: {
    height: TOPBAR_HEIGHT,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 22,
  },

  tabsRow: {
    height: TABS_HEIGHT,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    alignItems: "center",
  },

  tabText: { fontSize: 15, color: "#777", fontWeight: "600" },

  activeTab: {
    fontSize: 15,
    fontWeight: "700",
    color: "black",
    borderBottomWidth: 2,
    borderBottomColor: "black",
    paddingBottom: 4,
  },

  // ⭐ RESTORED YOUR UI IMAGE SIZING + TEXT STYLE
  banner: { width: "100%", height: 280, marginBottom: 10 },
  productList: {
    paddingHorizontal: screenWidth * 0.02,
    paddingTop: height * 0.09,
    paddingBottom: height * 0.15,
  },
  productCard: {
    backgroundColor: '#fff',
    width: '48%',
    borderRadius: screenWidth * 0.02,
    marginBottom: height * 0.015,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  productImage: { width: '100%', height: height * 0.38, resizeMode: 'cover' },
  productDetails: { padding: screenWidth * 0.02 },
  productName: {
    fontSize: screenWidth * 0.035,
    fontWeight: '500',
    marginBottom: height * 0.005,
  },
  productPrice: { fontSize: screenWidth * 0.04, fontWeight: '700' },
  wishlistButton: {
    position: 'absolute',
    top: height * 0.012,
    right: screenWidth * 0.02,
    zIndex: 10,
  },
  bundleList: {
    paddingHorizontal: screenWidth * 0.02,
    paddingTop: height * 0.02, // or HEADER_HEIGHT if you like
    paddingBottom: height * 0.15,
  },
  bundleCard: {
    backgroundColor: '#fff',
    borderRadius: screenWidth * 0.03,
    marginBottom: height * 0.02,
    overflow: 'hidden',
    borderWidth: 0.6,
    borderColor: '#E5E7EB',
  },
  bundleMainImage: {
    width: '100%',
    height: height * 0.28,
    resizeMode: 'cover',
  },
  bundleContent: {
    padding: screenWidth * 0.03,
  },
  bundleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.007,
  },
  bundleTitle: {
    fontSize: screenWidth * 0.04,
    fontWeight: '700',
    flex: 1,
    marginRight: screenWidth * 0.02,
  },
  bundlePrice: {
    fontSize: screenWidth * 0.042,
    fontWeight: '800',
  },
  bundleDescription: {
    fontSize: screenWidth * 0.032,
    color: '#4B5563',
    marginBottom: height * 0.005,
  },
  bundleItemsInfo: {
    fontSize: screenWidth * 0.032,
    fontWeight: '500',
    color: '#111827',
    marginBottom: height * 0.008,
  },
  bundleProductsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bundleProductThumbWrapper: {
    width: screenWidth * 0.12,
    height: screenWidth * 0.12,
    borderRadius: screenWidth * 0.02,
    overflow: 'hidden',
    marginRight: screenWidth * 0.02,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  bundleProductThumb: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bundleMoreText: {
    fontSize: screenWidth * 0.032,
    fontWeight: '600',
    color: '#4B5563',
  },


  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: screenWidth * 0.045,
    fontWeight: '600',
    color: '#555',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

});
