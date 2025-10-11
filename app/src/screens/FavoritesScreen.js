import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([
    { id: 1, name: 'Classic Hoodie', price: 1200, image: 'https://via.placeholder.com/150', onSale: true, discount: 200 },
    { id: 2, name: 'Slim Fit Pants', price: 1500, image: 'https://via.placeholder.com/150' },
  ]);

  const handleRemove = (id) => {
    Alert.alert('Remove Favorite', 'Are you sure you want to remove this item?', [
      { text: 'Cancel' },
      { text: 'Remove', onPress: () => setFavorites(favorites.filter(item => item.id !== id)), style: 'destructive' },
    ]);
  };

  const handleAddToCart = (item) => {
    Alert.alert('Added to Cart', `${item.name} has been added to your cart!`);
  };

  const totalPrice = favorites.reduce((sum, item) => {
    const price = item.onSale ? item.price - item.discount : item.price;
    return sum + price;
  }, 0);

  const renderFavorite = ({ item }) => (
    <View style={styles.card}>
      {/* Delete X button */}
      <TouchableOpacity style={styles.deleteBtn} onPress={() => handleRemove(item.id)}>
        <Text style={styles.deleteText}>X</Text>
      </TouchableOpacity>

      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.priceRow}>
          {item.onSale ? (
            <>
              <Text style={styles.originalPrice}>₹{item.price}</Text>
              <Text style={styles.salePrice}>₹{item.price - item.discount}</Text>
            </>
          ) : (
            <Text style={styles.salePrice}>₹{item.price}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.cartBtn} onPress={() => handleAddToCart(item)}>
          <Text style={styles.cartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites ❤️</Text>

      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Image source={{ uri: 'https://via.placeholder.com/200?text=No+Favorites' }} style={styles.emptyImage} />
          <Text style={styles.emptyText}>You haven't added any favorite products yet</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={favorites}
            keyExtractor={item => item.id.toString()}
            renderItem={renderFavorite}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />

          {/* Optional Order Section */}
          <View style={styles.orderSection}>
            <Text style={styles.totalText}>Total: ₹{totalPrice}</Text>
            <TouchableOpacity style={styles.orderBtn} onPress={() => Alert.alert('Order', 'Proceed to checkout')}>
              <Text style={styles.orderText}>Order Now</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA', padding: 16 },
  title: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 20 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyImage: { width: 180, height: 180, marginBottom: 16, borderRadius: 12 },
  emptyText: { fontSize: 16, color: '#6B7280', textAlign: 'center', paddingHorizontal: 20 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    position: 'relative',
  },
  deleteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  deleteText: { color: '#EF4444', fontSize: 18, fontWeight: '700' },
  image: { width: 90, height: 90, borderRadius: 12, marginRight: 16 },
  info: { flex: 1, justifyContent: 'space-between' },
  name: { fontSize: 16, fontWeight: '600', color: '#111827' },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  originalPrice: { fontSize: 14, color: '#9CA3AF', textDecorationLine: 'line-through', marginRight: 8 },
  salePrice: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  cartBtn: { marginTop: 10, backgroundColor: '#FF6347', paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  cartText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  orderSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: { fontSize: 16, fontWeight: '700', color: '#111827' },
  orderBtn: { backgroundColor: '#111827', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  orderText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
