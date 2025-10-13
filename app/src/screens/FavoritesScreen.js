import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert, StyleSheet, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWishlist } from '../context/WishlistContext';
import { api } from '../utils/config';
import { useCart } from '../context/CartContext';

export default function FavoritesScreen({ navigation }) {
   const { add } = useCart();
  const { wishlist, removeFromWishlist, addToWishlist, isInWishlist } = useWishlist(); 
  const [products, setProducts] = useState([]);
  const [sizeModalVisible, setSizeModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/api/products');
        const items = res.data.items || [];
        setProducts(items);
      } catch (err) {
        console.log('Failed to fetch products:', err);
      }
    };
    fetchProducts();
  }, []);

  const wishlistProducts = useMemo(() => {
    return products.filter(p => wishlist.includes(p._id.toString()));
  }, [products, wishlist]);

  const toggleWishlist = (productId) => {
    if (isInWishlist(productId)) removeFromWishlist(productId);
    else addToWishlist(productId);
  };

  const openSizeModal = (product) => {
    setSelectedProduct(product);
    setSizeModalVisible(true);
  };

  const addToCart = (size) => {
    if (!selectedProduct) return;
    // Replace this with your real cart function: add(selectedProduct._id, size)
    console.log(`Added ${selectedProduct.title} (${size}) to cart`);
    Alert.alert('Added to Cart', `${selectedProduct.title} (${size}) has been added to your cart!`);
    setSizeModalVisible(false);
    setSelectedProduct(null);
  };

  const renderProductCard = ({ item }) => {
    const fav = isInWishlist(item._id);
    const sizes = item.sizes || ['XS','S','M','L','XL','XXL'];

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('ProductScreen', { id: item._id })}
        activeOpacity={0.8}
        style={styles.productCard}
      >
        {/* Wishlist Button */}
        <TouchableOpacity
          onPress={() => toggleWishlist(item._id)}
          style={styles.wishlistButton}
        >
          <Ionicons
            name={fav ? 'heart' : 'heart-outline'}
            size={20}
            color={fav ? '#FF6347' : '#fff'}
          />
        </TouchableOpacity>

        {/* Product Image */}
        <Image
          source={{ uri: item.images?.[0] || 'https://via.placeholder.com/150' }}
          style={styles.productImage}
        />

        {/* Product Name + Add to Cart Icon */}
        <View style={styles.productRow}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.title}
          </Text>
          <TouchableOpacity onPress={() => openSizeModal(item)}>
            <Ionicons name="cart-outline" size={22} color="#111" />
          </TouchableOpacity>
        </View>

        {/* Product Price */}
        <Text style={styles.productPrice}>₹{item.price}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Favorites</Text>

      {wishlistProducts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>You haven't added any favorite products yet</Text>
        </View>
      ) : (
  <FlatList
  data={wishlistProducts}
  keyExtractor={(item, index) => `${item._id}-${index}`} // unique for each row
  numColumns={2}
  columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 12 }}
  renderItem={renderProductCard}
  contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 120 }}
  showsVerticalScrollIndicator={false}
/>

      )}

      {/* Size Selection Modal */}
<Modal
  visible={sizeModalVisible}
  transparent={true}
  animationType="fade"
  onRequestClose={() => setSizeModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Select Size</Text>

      {/* Sizes */}
      <View style={styles.sizeList}>
        {(selectedProduct?.sizes && selectedProduct.sizes.length > 0
          ? selectedProduct.sizes
          : ['XS', 'S', 'M', 'L', 'XL', 'XXL']
        ).map((size) => (
          <TouchableOpacity
            key={size}
            style={styles.sizeButton}
            onPress={() => {
              add(selectedProduct._id, size);
              setSizeModalVisible(false);
            }}
          >
            <Text style={styles.sizeButtonText}>{size}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Cancel button */}
      <TouchableOpacity
        style={styles.modalClose}
        onPress={() => setSizeModalVisible(false)}
      >
        <Text style={styles.modalCloseText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 16, paddingHorizontal: 8 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center' },

  productCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 8,
    position: 'relative',
    marginHorizontal: 4,
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: '#111',
    padding: 6,
    borderRadius: 20,
  },
  productImage: { width: '100%', height: 140, borderRadius: 8, marginBottom: 8 },
  productRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productName: { fontSize: 14, fontWeight: '600', color: '#111', flex: 1 },
  productPrice: { fontSize: 14, fontWeight: '700', color: '#111', marginTop: 4 },

modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'center',      // center vertically
  alignItems: 'center',          // center horizontally
},
modalContent: {
  backgroundColor: '#fff',
  borderRadius: 20,
  padding: 20,
  width: '80%',
  alignItems: 'center',
},
modalTitle: {
  fontSize: 18,
  fontWeight: '700',
  marginBottom: 16,
},
sizeList: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginBottom: 16,
},
sizeButton: {
  backgroundColor: '#111',
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 6,
  margin: 4,
},
sizeButtonText: {
  color: '#fff',
  fontWeight: '600',
},
modalClose: {
  backgroundColor: '#FF6347',
  paddingVertical: 10,
  paddingHorizontal: 30,
  borderRadius: 8,
  marginTop: 8,
},
modalCloseText: {
  color: '#fff',
  fontWeight: '600',
},

});
