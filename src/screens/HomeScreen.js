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
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../utils/config';
import { Ionicons } from '@expo/vector-icons';
import { useWishlist } from '../context/WishlistContext';
import { StatusBar } from 'expo-status-bar';

import b1 from '../assets/banner1.jpg';
import b2 from '../assets/banner2.jpg';
import b3 from '../assets/banner3.jpg';

const { height, width: screenWidth } = Dimensions.get('window');
const TABS = ['HOME', 'MENS', 'BUNDLE', 'NEW ARRIVALS'];

export default function HomeScreen({ navigation }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { width } = useWindowDimensions(); // 👈 actual viewport width

  const [allProducts, setAllProducts] = useState([]);
  const [bundleProducts, setBundleProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingBundle, setLoadingBundle] = useState(false);

  // 0 = HOME, 1 = MENS, 2 = BUNDLE, 3 = NEW ARRIVALS
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const homeBanners = [b1, b2, b3, b1, b2, b3, b1, b2, b3];

  const pagerRef = useRef(null);

  // scroll for header animation
  const scrollYHome = useRef(new Animated.Value(0)).current;
  const scrollYProducts = useRef(new Animated.Value(0)).current;

  const diffClampScrollYHome = useRef(
    Animated.diffClamp(scrollYHome, 0, 120)
  ).current;
  const diffClampScrollYProducts = useRef(
    Animated.diffClamp(scrollYProducts, 0, 120)
  ).current;

  const isHome = activeTabIndex === 0;
  const diffClampScrollY = isHome ? diffClampScrollYHome : diffClampScrollYProducts;

  const translateY = diffClampScrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, -160],
    extrapolate: 'clamp',
  });

  const bgColor = diffClampScrollY.interpolate({
    inputRange: [0, 120],
    outputRange: ['rgba(255,255,255,1)', 'rgba(255,255,255,0)'],
    extrapolate: 'clamp',
  });

  // ---------- API CALLS ----------

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
    if (activeTabIndex === 2 && bundleProducts.length === 0 && !loadingBundle) {
      fetchBundleProducts();
    }
  }, [activeTabIndex]);

  // ---------- TAB HANDLERS ----------

  const handleTabPress = (index) => {
    setActiveTabIndex(index);
    if (pagerRef.current) {
      pagerRef.current.scrollToIndex({ index, animated: true });
    }
  };

  const handleHorizontalMomentumEnd = (e) => {
    const pageIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    if (pageIndex !== activeTabIndex) {
      setActiveTabIndex(pageIndex);
    }
  };

  if (loading && allProducts.length === 0) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1F2937" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="dark-content" />

      {/* 🔝 Top Bar + Tabs Animated */}
      <Animated.View
        style={[
          styles.topBarContainer,
          { transform: [{ translateY }] },
        ]}
      >
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: bgColor, zIndex: -1 }]}
          pointerEvents="none"
        />

        <View style={styles.topBar}>
          <View style={styles.topIcons}>
            <Ionicons name="notifications-outline" size={32} color="black" />
            <Ionicons name="heart-outline" size={32} color="black" />
            <Ionicons name="cart-outline" size={32} color="black" />
          </View>
        </View>

        <View style={styles.tabsRow}>
          {TABS.map((tab, index) => {
            const isActive = index === activeTabIndex;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
                onPress={() => handleTabPress(index)}
              >
                <Text
                  style={[styles.tabText, isActive && styles.tabTextActive]}
                  numberOfLines={1}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>

      {/* 🔁 Horizontal pager (swipe left/right) */}
      <FlatList
        ref={pagerRef}
        data={TABS}
        keyExtractor={(item) => item}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }} // make it fill screen
        onMomentumScrollEnd={handleHorizontalMomentumEnd}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ index }) => {
          const isHomePage = index === 0;
          const isMensPage = index === 1;
          const isBundlePage = index === 2;
          const isNewArrivalsPage = index === 3;

          return (
            <View style={{ width }}>
          {isHomePage && (
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
)}


              {isMensPage && (
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
                            name={isFav ? 'heart' : 'heart-outline'}
                            size={24}
                            color={isFav ? '#FF6347' : 'black'}
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
              )}

              {isBundlePage && (
                loadingBundle && bundleProducts.length === 0 ? (
                  <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#1F2937" />
                  </View>
                ) : (
                  <Animated.FlatList
                    nestedScrollEnabled
                    data={bundleProducts}
                    keyExtractor={(product) => product._id}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    contentContainerStyle={styles.productList}
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
                              name={isFav ? 'heart' : 'heart-outline'}
                              size={24}
                              color={isFav ? '#FF6347' : 'black'}
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
                )
              )}

              {isNewArrivalsPage && (
                <View style={[styles.emptyState, { paddingTop: height * 0.2 }]}>
                  <Text style={styles.emptyText}>New arrivals coming soon 👀</Text>
                </View>
              )}
            </View>
          );
        }}
      />
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
    paddingHorizontal: screenWidth * 0.04,
    paddingTop: height * 0.03,
  },
  topIcons: { flexDirection: 'row', gap: screenWidth * 0.09 },

  tabsRow: {
    flexDirection: 'row',
    marginTop: height * 0.02,
    paddingHorizontal: screenWidth * 0.04,
    paddingBottom: height * 0.01,
    justifyContent: 'space-between',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: height * 0.01,
    marginHorizontal: screenWidth * 0.01,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  tabItemActive: {
    borderColor: '#000',
  },
  tabText: {
    fontSize: screenWidth * 0.035,
    fontWeight: '500',
    color: '#555',
  },
  tabTextActive: {
    color: '#000',
    fontWeight: '700',
  },

  bannerImage: { width: screenWidth, height, resizeMode: 'cover' },

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
});
