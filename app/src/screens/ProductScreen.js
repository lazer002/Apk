import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../utils/config';
import { useFavorites } from '../context/FavoritesContext'; // ✅ import FavoritesContext

export default function ProductScreen({ route, navigation }) {
  const { id } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Favorites
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.post(`/api/products/${id}`);
        setProduct(res.data);
        setFavorite(isFavorite(res.data._id)); // initialize favorite state
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const toggleFavorite = () => {
    if (!product) return;
    if (favorite) {
      removeFavorite(product._id);
      setFavorite(false);
    } else {
      addFavorite(product);
      setFavorite(true);
    }
  };

  if (loading)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );

  if (!product)
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Not found</Text>
      </View>
    );

  return (
    <ScrollView className="flex-1 bg-white">
      <Image
        source={{ uri: product.images?.[0] }}
        style={{ width: '100%', height: 320, backgroundColor: '#eee' }}
      />

      <View className="p-4 flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-xl font-bold">{product.title}</Text>
          <Text className="text-lg text-gray-700 mt-1">₹{product.price}</Text>
          <Text className="text-gray-500 mt-2">{product.description}</Text>
        </View>

        {/* ✅ Favorite button */}
        <TouchableOpacity onPress={toggleFavorite} className="ml-4 mt-1">
          <Ionicons name={favorite ? 'heart' : 'heart-outline'} size={28} color={favorite ? 'red' : 'gray'} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="mt-4 bg-black py-3 rounded-md mx-4"
        onPress={() => navigation.navigate('Cart', { add: { productId: product._id } })}
      >
        <Text className="text-center text-white font-semibold">Add to Cart</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
