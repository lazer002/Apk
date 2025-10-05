import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { getApiBaseUrl } from '../utils/config';

const categories = [
  { id: 1, name: 'T-Shirts', image: 'https://via.placeholder.com/100x100?text=TShirt' },
  { id: 2, name: 'Jeans', image: 'https://via.placeholder.com/100x100?text=Jeans' },
  { id: 3, name: 'Jackets', image: 'https://via.placeholder.com/100x100?text=Jacket' },
  { id: 4, name: 'Shoes', image: 'https://via.placeholder.com/100x100?text=Shoes' },
  { id: 5, name: 'Accessories', image: 'https://via.placeholder.com/100x100?text=Cap' },
];

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/api/products`);
        const data = await res.json();
        setProducts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6347" />
        <Text style={{ marginTop: 10 }}>Loading products...</Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🔥 Hero Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Fashion Sale</Text>
          <Text style={styles.bannerSubtitle}>Up to 50% OFF on New Collection</Text>
        </View>

        {/* 🔥 Categories */}
        <View style={{ marginTop: 16 }}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.catCard}
                onPress={() => alert(`Show ${cat.name} products`)}
              >
                <Image source={{ uri: cat.image }} style={styles.catImage} />
                <Text style={styles.catText}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 🔥 Popular Products */}
        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionTitle}>Popular Products</Text>
          <FlatList
            data={products.slice(0, 4)}
            keyExtractor={(item) => String(item._id)}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            scrollEnabled={false}
            contentContainerStyle={{ paddingVertical: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productCard}
                onPress={() => navigation.navigate('Product', { id: item._id })}
              >
                <Image
                  source={{ uri: item.images?.[0] }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                <Text style={styles.productName} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.productPrice}>₹{item.price}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* 🔥 Deals of the Day */}
        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionTitle}>Deals of the Day</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {products.slice(4, 8).map((item) => (
              <TouchableOpacity
                key={item._id}
                style={styles.dealCard}
                onPress={() => navigation.navigate('Product', { id: item._id })}
              >
                <Image source={{ uri: item.images?.[0] }} style={styles.dealImage} />
                <Text style={styles.dealName} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.dealPrice}>₹{item.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 🔥 Trending Now */}
        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <FlatList
            data={products.slice(8, 12)}
            keyExtractor={(item) => String(item._id)}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            scrollEnabled={false}
            contentContainerStyle={{ paddingVertical: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productCard}
                onPress={() => navigation.navigate('Product', { id: item._id })}
              >
                <Image source={{ uri: item.images?.[0] }} style={styles.productImage} />
                <Text style={styles.productName} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.productPrice}>₹{item.price}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* 🔥 Recommended */}
        <View style={{ marginTop: 20, marginBottom: 30 }}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {products.slice(12, 16).map((item) => (
              <TouchableOpacity
                key={item._id}
                style={styles.recommendCard}
                onPress={() => navigation.navigate('Product', { id: item._id })}
              >
                <Image source={{ uri: item.images?.[0] }} style={styles.recommendImage} />
                <Text style={styles.recommendName} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.recommendPrice}>₹{item.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  banner: {
    backgroundColor: '#FF6347',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  bannerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  bannerSubtitle: { fontSize: 14, color: '#fff', marginTop: 5 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  catCard: { alignItems: 'center', marginRight: 16 },
  catImage: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#eee' },
  catText: { marginTop: 5, fontSize: 12, fontWeight: '500' },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  productImage: { width: '100%', height: 150, borderRadius: 10, backgroundColor: '#eee' },
  productName: { fontSize: 14, fontWeight: '600', marginTop: 8 },
  productPrice: { fontSize: 14, fontWeight: 'bold', color: '#FF6347', marginTop: 4 },
  dealCard: { width: 140, marginRight: 12 },
  dealImage: { width: '100%', height: 120, borderRadius: 10, backgroundColor: '#eee' },
  dealName: { fontSize: 13, fontWeight: '500', marginTop: 6 },
  dealPrice: { fontSize: 14, fontWeight: 'bold', color: '#FF6347' },
  recommendCard: { width: 120, marginRight: 12 },
  recommendImage: { width: '100%', height: 100, borderRadius: 10, backgroundColor: '#eee' },
  recommendName: { fontSize: 12, marginTop: 4 },
  recommendPrice: { fontSize: 13, fontWeight: 'bold', color: '#FF6347' },
});
