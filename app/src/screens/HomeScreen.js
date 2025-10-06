import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../utils/config';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Chairs');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/public/categories');
      setCategories(Array.isArray(res.data.categories) ? res.data.categories : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

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

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Filter products by category and search
  const filteredProducts = products.filter(
    (p) =>
      p.category.toLowerCase() === selectedCategory.toLowerCase() &&
      p.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const newArrivals = products.filter((p) => p.isNewProduct);
  const bestSellers = products.slice(0, 5); // example: top 5 products

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1F2937" />
      </View>
    );
  }

  const handleAddToCart = (item) => {
    Alert.alert('Added to Cart', `${item.title} has been added to your cart!`);
  };


  const trendingProducts = products.slice(0, 5); // example
const topRatedProducts = products
  .filter(p => p.rating)
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 5);
const discountedProducts = products.filter(p => p.onSale);
const featuredCollections = categories.slice(0, 5); 

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Discover the Best Furniture</Text>
        <Image source={{ uri: 'https://i.pravatar.cc/100' }} style={styles.avatar} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          placeholder="Search for furniture"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity>
          <Ionicons name="options-outline" size={20} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat._id}
            style={[
              styles.categoryBtn,
              selectedCategory === cat.name ? styles.categoryBtnActive : styles.categoryBtnInactive,
            ]}
            onPress={() => setSelectedCategory(cat.name)}
          >
            <Text
              style={selectedCategory === cat.name ? styles.categoryTextActive : styles.categoryTextInactive}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Filtered Products */}
      <Text style={styles.sectionTitle}>{selectedCategory} Products</Text>
      <FlatList
        data={filteredProducts}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        style={{ marginBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image
              source={{ uri: item.images[0] || 'https://via.placeholder.com/150' }}
              style={styles.productImage}
            />
            {item.isNewProduct && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>NEW</Text>
              </View>
            )}
            {item.onSale && (
              <View style={[styles.badge, { backgroundColor: '#10B981', top: 30 }]}>
                <Text style={styles.badgeText}>SALE</Text>
              </View>
            )}
            <Text style={styles.productName}>{item.title}</Text>
            <Text style={styles.productSub} numberOfLines={2}>
              {item.description || 'No description'}
            </Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>${item.price}</Text>
              <TouchableOpacity style={styles.addBtn} onPress={() => handleAddToCart(item)}>
                <Ionicons name="add" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>New Arrivals</Text>
          <FlatList
            data={newArrivals}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => 'na-' + item._id}
            renderItem={({ item }) => (
              <View style={styles.productCard}>
                <Image
                  source={{ uri: item.images[0] || 'https://via.placeholder.com/150' }}
                  style={styles.productImage}
                />
                <Text style={styles.productName}>{item.title}</Text>
                <Text style={styles.productSub} numberOfLines={2}>
                  {item.description || 'No description'}
                </Text>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>${item.price}</Text>
                  <TouchableOpacity style={styles.addBtn} onPress={() => handleAddToCart(item)}>
                    <Ionicons name="add" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </>
      )}

      {/* Best Sellers */}
      <Text style={styles.sectionTitle}>Best Sellers</Text>
      <FlatList
        data={bestSellers}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => 'bs-' + item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.bestSellerCard}>
            <Image
              source={{ uri: item.images[0] || 'https://via.placeholder.com/80' }}
              style={styles.bestSellerImage}
            />
            <View style={styles.bestSellerInfo}>
              <Text style={styles.bestSellerName}>{item.title}</Text>
              <Text style={styles.bestSellerSub} numberOfLines={1}>
                {item.description || 'No description'}
              </Text>
              <Text style={styles.bestSellerPrice}>${item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />



	  {trendingProducts.length > 0 && (
  <>
    <Text style={styles.sectionTitle}>Trending Now</Text>
    <FlatList
      data={trendingProducts}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => 'tr-' + item._id}
      renderItem={({ item }) => (
        <View style={styles.productCard}>
          <Image source={{ uri: item.images[0] || 'https://via.placeholder.com/150' }} style={styles.productImage} />
          <Text style={styles.productName}>{item.title}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>${item.price}</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => handleAddToCart(item)}>
              <Ionicons name="add" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  </>
)}

{/* Top Rated */}
{topRatedProducts.length > 0 && (
  <>
    <Text style={styles.sectionTitle}>Top Rated</Text>
    <FlatList
      data={topRatedProducts}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => 'tp-' + item._id}
      renderItem={({ item }) => (
        <View style={styles.productCard}>
          <Image source={{ uri: item.images[0] || 'https://via.placeholder.com/150' }} style={styles.productImage} />
          <Text style={styles.productName}>{item.title}</Text>
          <Text style={styles.productSub}>{item.rating} ⭐</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>${item.price}</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => handleAddToCart(item)}>
              <Ionicons name="add" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  </>
)}

{/* On Sale */}
{discountedProducts.length > 0 && (
  <>
    <Text style={styles.sectionTitle}>On Sale</Text>
    <FlatList
      data={discountedProducts}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => 'ds-' + item._id}
      renderItem={({ item }) => (
        <View style={styles.productCard}>
          <Image source={{ uri: item.images[0] || 'https://via.placeholder.com/150' }} style={styles.productImage} />
          <View style={[styles.badge, { backgroundColor: '#10B981', top: 30 }]}>
            <Text style={styles.badgeText}>SALE</Text>
          </View>
          <Text style={styles.productName}>{item.title}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>${item.price}</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => handleAddToCart(item)}>
              <Ionicons name="add" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  </>
)}

{/* Featured Collections */}
{featuredCollections.length > 0 && (
  <>
    <Text style={styles.sectionTitle}>Featured Collections</Text>
    <FlatList
      data={featuredCollections}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => 'fc-' + item._id}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.featuredCard}>
          <Image source={{ uri: item.image || 'https://via.placeholder.com/120' }} style={styles.featuredImage} />
          <Text style={styles.featuredName}>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  </>
)}
    </ScrollView>
  );
}

// Styles remain unchanged
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 16 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerText: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 16 },
  searchInput: { flex: 1, marginLeft: 8 },
  categories: { marginBottom: 16 },
  categoryBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  categoryBtnActive: { backgroundColor: '#1F2937' },
  categoryBtnInactive: { backgroundColor: '#E5E7EB' },
  categoryTextActive: { color: 'white', fontWeight: '600' },
  categoryTextInactive: { color: '#1F2937', fontWeight: '600' },
  productCard: { width: 160, backgroundColor: '#F9FAFB', borderRadius: 16, marginRight: 16, padding: 8 },
  productImage: { width: '100%', height: 128, borderRadius: 16 },
  badge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#EF4444', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  productName: { fontSize: 14, fontWeight: '600', marginTop: 4 },
  productSub: { fontSize: 12, color: '#6B7280' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  price: { fontSize: 14, fontWeight: 'bold', color: '#1F2937' },
  addBtn: { backgroundColor: '#1F2937', padding: 4, borderRadius: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, marginTop: 16 },
  bestSellerCard: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 16, padding: 8, marginRight: 16, width: 280 },
  bestSellerImage: { width: 80, height: 80, borderRadius: 16, marginRight: 12 },
  bestSellerInfo: { flex: 1, justifyContent: 'space-between' },
  bestSellerName: { fontWeight: '600' },
  bestSellerSub: { fontSize: 12, color: '#6B7280' },
  bestSellerPrice: { fontWeight: 'bold', color: '#1F2937' },
  featuredCard: { width: 120, height: 140, marginRight: 12, borderRadius: 16, overflow: 'hidden', backgroundColor: '#F3F4F6', justifyContent: 'flex-end', padding: 8 },
featuredImage: { width: '100%', height: 100, borderRadius: 16 },
featuredName: { fontWeight: '600', textAlign: 'center', marginTop: 4 },
});
