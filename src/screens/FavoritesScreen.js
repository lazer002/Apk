import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
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

  const renderProductCard = ({ item }) => {
    const fav = isInWishlist(item._id);

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Home', {
            screen: 'ProductScreen',
            params: { id: item._id },
          })
        }
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
            size={22}
            color={fav ? '#FF6363' : '#111'}
          />
        </TouchableOpacity>

        {/* Product Image */}
        <Image
          source={{ uri: item.images?.[0] || 'https://via.placeholder.com/150' }}
          style={styles.productImage}
        />

        {/* Product Details */}
        <View style={styles.productDetails}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.productPrice}>₹{item.price}</Text>
          <TouchableOpacity onPress={() => openSizeModal(item)}>
            <Ionicons name="cart-outline" size={22} color="#111" />
          </TouchableOpacity>
        </View>
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
          keyExtractor={(item) => item._id.toString()}
          numColumns={2}
          renderItem={renderProductCard}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 12 }}
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 120 }}
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
  container: { flex: 1, backgroundColor: '#F9FAFB', paddingTop: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#111', marginBottom: 16 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center' },

  productCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    marginHorizontal: 4,
    overflow: 'hidden',
    height: 300,
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    padding: 6,
    borderRadius: 20,
  },
  productImage: {
    width: '100%',
    height: '80%', // 80% image
    resizeMode: 'cover',
  },
  productDetails: {
    height: '20%', // 20% details
    paddingHorizontal: 10,
    paddingVertical: 4,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#FF6363',
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
