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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../utils/config';
import { Ionicons } from "@expo/vector-icons";
import HeroBanner from '../components/HeroBanner';
import Marquee from '../components/Marquee';
import {useWishlist}  from '../context/WishlistContext';


export default function HomeScreen({ navigation }) {
const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

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
      const res = await api.get('/api/categories');
      const cats = Array.isArray(res.data.categories) ? res.data.categories : [];
      setCategories([{ _id: 'all', name: 'All' }, ...cats]); // prepend "All"
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([{ _id: 'all', name: 'All' }]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

const filteredProducts = products.filter((p) => {
  const categoryName = p.category?.name || ""; 
  const matchesCategory =
    selectedCategory === "All" || categoryName.toLowerCase() === selectedCategory.toLowerCase();
  const matchesSearch = p.title.toLowerCase().includes(searchText.toLowerCase());
  return matchesCategory && matchesSearch;
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
  {/* ===== Header + Categories ===== */}
  <View style={styles.headerContainer}>
    <Text style={styles.header}>Products</Text>

    {/* 🔍 Search Bar */}
    <View style={styles.searchBarContainer}>
    <View style={styles.searchBar}>
      <Ionicons name="search" size={20} color="gray" />
      <TextInput
        placeholder="Search products..."
        style={styles.searchInput}
        value={searchText}
        onChangeText={setSearchText}
      />
    </View>
    </View>
{/* ===== Hero Banner ===== */}

<HeroBanner/>
    <Marquee />
    {/* 🏷 Categories */}
    <View style={styles.categoriesWrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 12 }}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat._id}
            style={[
              styles.categoryBtn,
              selectedCategory === cat.name
                ? styles.categoryBtnActive
                : styles.categoryBtnInactive,
            ]}
            onPress={() => setSelectedCategory(cat.name)}
          >
            <Text
              style={
                selectedCategory === cat.name
                  ? styles.categoryTextActive
                  : styles.categoryTextInactive
              }
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  </View>

  {/* ===== Product Grid ===== */}
<FlatList
  data={filteredProducts}
  keyExtractor={(item) => item._id}
  numColumns={filteredProducts.length === 1 ? 1 : 2} 
  key={filteredProducts.length === 1 ? 'grid-1' : 'grid-2'} 
  showsVerticalScrollIndicator={false}
  renderItem={({ item }) => {
    const isFav = isInWishlist(item._id); // from your WishlistContext

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('ProductScreen', { id: item._id })}
        activeOpacity={0.8}
        style={[
          styles.productCard,
          filteredProducts.length === 1 && { width: '50%' },
        ]}
      >
    <TouchableOpacity
  onPress={() =>
    isInWishlist(item._id)
      ? removeFromWishlist(item._id)
      : addToWishlist(item._id)
  }
  style={styles.wishlistButton}
>
  <Ionicons
    name={isInWishlist(item._id) ? 'heart' : 'heart-outline'}
    size={20}
    color={isInWishlist(item._id) ? '#FF6347' : 'black'}
  />
</TouchableOpacity>
        <Image
          source={{ uri: item.images[0] || 'https://via.placeholder.com/150' }}
          style={styles.productImage}
        />
        <View style={styles.productDetails}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.productPrice}>${item.price}</Text>
        </View>
      </TouchableOpacity>
    );
  }}
  columnWrapperStyle={
    filteredProducts.length > 1
      ? { justifyContent: 'space-between', marginBottom: 2 }
      : null
  }
  contentContainerStyle={{
    paddingHorizontal: 8,
    paddingBottom: 120,
  }}
/>




</SafeAreaView>

  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  // headerContainer: { padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  searchBarContainer: { paddingHorizontal: 16, marginBottom: 8 },
searchBar: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#F3F4F6',
  // borderRadius: 12,
  paddingHorizontal: 22,
  paddingVertical: 8,
  marginBottom: 16,
},
searchInput: {
  flex: 1,
  marginLeft: 8,
  fontSize: 14,
  color: '#1F2937',
},
wishlistButton: {
  position: 'absolute',
  top: 6,
  right: 6,
  zIndex: 10,
  padding: 4,
  borderRadius: 12,
},


categoriesWrapper:{
  paddingHorizontal: 16,
},
categoriesContainer: { paddingVertical: 12 }, // give some top-bottom padding
categoryBtn: {
  paddingHorizontal: 20,
  paddingVertical: 10,
  borderRadius: 25,
  marginRight: 12,
  minWidth: 60, // ensures small categories don't shrink too much
  justifyContent: 'center',
  alignItems: 'center',
},
categoryBtnActive: { backgroundColor: '#1F2937' },
categoryBtnInactive: { backgroundColor: '#E5E7EB' },
categoryTextActive: { color: 'white', fontWeight: '600' },
categoryTextInactive: { color: '#1F2937', fontWeight: '600' },

productsContainer: {
  // paddingHorizontal: 6, // padding on left and right of the whole grid
  paddingBottom: 120, // same as before for scroll bottom
},
productCard: {
  flex: 1,
  marginHorizontal: 1,
  backgroundColor: '#fff',
  borderRadius: 0,
  borderWidth: 0.5,
  borderColor: '#E5E7EB',
  overflow: 'hidden',
  height: 350,
},

productImage: {
  width: '100%',
  height: '80%', // 🔥 takes 80% of card height
  resizeMode: 'cover',
},

productDetails: {
  height: '20%', // 🔥 bottom 20%
  paddingHorizontal: 8,
  justifyContent: 'center',
  alignItems: 'flex-start',
},

productName: {
  fontSize: 14,
  fontWeight: '500',
  color: '#1F2937',
  marginBottom: 2,
  textAlign: 'left',
},

productPrice: {
  fontSize: 15,
  fontWeight: '700',
  color: '#000',
},



});
