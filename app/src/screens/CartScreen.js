import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, FlatList, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { api, getApiBaseUrl } from '../utils/config';
import { getToken } from '../utils/token';
import { Ionicons } from '@expo/vector-icons';

export default function CartScreen({ navigation }) {
  const [items, setItems] = useState([]);

const load = async () => {
  try {
    const token = await getToken();
    const res = await fetch(`${getApiBaseUrl()}/api/cart`, {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error('Error loading cart:', err);
    setItems([]);
  }
};
  useEffect(() => {
    load();
  }, []);

  const handleRemove = (id) => {
    Alert.alert('Remove Item', 'Are you sure you want to remove this item?', [
      { text: 'Cancel' },
      {
        text: 'Remove',
        onPress: () => setItems(items.filter((item) => item.id !== id)),
        style: 'destructive',
      },
    ]);
  };

  const handleQtyChange = (id, delta) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

 const total = Array.isArray(items)
  ? items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
  : 0;


  return (
    <SafeAreaView style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="cart-outline" size={80} color="#9CA3AF" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 120 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image
                  source={{ uri: item.image || 'https://via.placeholder.com/80' }}
                  style={styles.image}
                />
                <View style={styles.info}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.price}>₹{item.price}</Text>
                  <View style={styles.qtyRow}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => handleQtyChange(item.id, -1)}
                    >
                      <Ionicons name="remove" size={18} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => handleQtyChange(item.id, 1)}
                    >
                      <Ionicons name="add" size={18} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleRemove(item.id)} style={{ marginLeft: 12 }}>
                      <Ionicons name="trash-outline" size={22} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />

          {/* Checkout Section */}
          <View style={styles.checkout}>
            <Text style={styles.total}>Total: ₹{total}</Text>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => navigation.navigate('Checkout')}
            >
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#6B7280', marginTop: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  image: { width: 80, height: 80, borderRadius: 12, marginRight: 12 },
  info: { flex: 1, justifyContent: 'space-between' },
  title: { fontSize: 16, fontWeight: '600', color: '#111827' },
  price: { fontSize: 14, fontWeight: 'bold', color: '#1F2937', marginTop: 4 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  qtyBtn: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  qtyText: { marginHorizontal: 12, fontSize: 16, fontWeight: '600' },
  checkout: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  total: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  checkoutBtn: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  checkoutText: { color: 'white', fontWeight: '600' },
});
