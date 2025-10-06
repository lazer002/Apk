import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([
    // Example data
    {
      id: 1,
      name: 'Classic Hoodie',
      price: 1200,
      image: 'https://via.placeholder.com/150',
      onSale: true,
      discount: 200,
    },
    {
      id: 2,
      name: 'Slim Fit Pants',
      price: 1500,
      image: 'https://via.placeholder.com/150',
    },
  ]);

  const handleRemove = (id) => {
    Alert.alert('Remove Favorite', 'Are you sure you want to remove this item?', [
      { text: 'Cancel' },
      {
        text: 'Remove',
        onPress: () => setFavorites(favorites.filter((item) => item.id !== id)),
        style: 'destructive',
      },
    ]);
  };

  const handleAddToCart = (item) => {
    Alert.alert('Added to Cart', `${item.name} has been added to your cart!`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Favorites ❤️</Text>

      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Image
            source={{ uri: 'https://via.placeholder.com/200?text=No+Favorites' }}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}>You haven't added any favorite products yet</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>₹{item.price}</Text>
                  {item.onSale && (
                    <Text style={styles.discount}>₹{item.price - item.discount}</Text>
                  )}
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.cartBtn}
                    onPress={() => handleAddToCart(item)}
                  >
                    <Ionicons name="cart-outline" size={18} color="white" />
                    <Text style={styles.cartText}>Add to Cart</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRemove(item.id)}>
                    <Ionicons name="trash-outline" size={22} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#1F2937' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyImage: { width: 200, height: 200, marginBottom: 16 },
  emptyText: { fontSize: 16, color: '#6B7280', textAlign: 'center', paddingHorizontal: 20 },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  image: { width: 80, height: 80, borderRadius: 12, marginRight: 12 },
  info: { flex: 1, justifyContent: 'space-between' },
  name: { fontSize: 16, fontWeight: '600', color: '#111827' },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  price: { fontSize: 14, fontWeight: 'bold', color: '#1F2937', marginRight: 8 },
  discount: { fontSize: 14, fontWeight: '600', color: '#10B981' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  cartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  cartText: { color: 'white', fontWeight: '600', marginLeft: 6 },
});
