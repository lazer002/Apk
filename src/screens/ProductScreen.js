import React, { useEffect, useState,useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  FlatList,
  LayoutAnimation,

} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { api } from '../utils/config';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');
// Enable LayoutAnimation for Android

export default function ProductScreen({ route, navigation }) {
 const { add } = useCart();
  const { id } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [favorite, setFavorite] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState({});
  const sizes = ["XS","S","M","L","XL","XXL"];
  const flatListRef = useRef(null);
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await api.get(`/api/products/${id}`);
        setProduct(res.data);
        setFavorite(isInWishlist(res.data._id));
      } catch (err) {
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);


  const onMomentumScrollEnd = (e) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveImage(newIndex);
  };

  const scrollToIndex = (index) => {
    setActiveImage(index);
    flatListRef.current?.scrollToOffset({ offset: index * width, animated: true });
  };

  const toggleAccordion = (key) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAccordionOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };



  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );

  if (!product)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: '#555' }}>Product not found</Text>
      </View>
    );
console.log(selectedSize)
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
      {/* Images */}
    <View>
      {/* Main swipeable image */}
      <FlatList
        ref={flatListRef}
        data={product.images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, idx) => idx.toString()}
        onMomentumScrollEnd={onMomentumScrollEnd}
        extraData={activeImage}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        )}
      />

      {/* Thumbnails */}
    <FlatList
        data={product.images}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, idx) => idx.toString()}
        style={{ marginTop: 12 }}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        extraData={activeImage} // important to re-render thumbnails
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => scrollToIndex(index)}>
            <Image
              source={{ uri: item }}
              style={[
                styles.thumbnail,
                activeImage === index && styles.activeThumbnail,
              ]}
            />
          </TouchableOpacity>
        )}
      />
    </View>

      {/* Info */}
      <View style={{ marginTop: 20 }}>
        <Text style={styles.title}>{product.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 6 }}>
          <Text style={styles.price}>₹ {product.price?.toFixed(2)}</Text>
          {product.discount && (
            <View style={styles.discountBadge}>
              <Text style={{ color: '#fff', fontSize: 12 }}>{product.discount}% OFF</Text>
            </View>
          )}
        </View>
      </View>

      {/* Size Selection */}
 {/* ----- SIZE SELECTION (Inventory Based) ----- */}
{product.inventory && (
  <View style={{ marginTop: 20 }}>
    <Text style={{ fontWeight: '600', marginBottom: 6 }}>Select Size:</Text>

    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {Object.entries(product.inventory).map(([size, qty]) => {
        const isAvailable = qty > 0;

        return (
          <TouchableOpacity
            key={size}
            disabled={!isAvailable}
            onPress={() => isAvailable && setSelectedSize(size)}
            style={[
              styles.sizePill,
              selectedSize === size && styles.selectedSize,
              !isAvailable && styles.disabledSize,
            ]}
          >
            <Text
              style={[
                selectedSize === size && { color: '#fff' },
                !isAvailable && { color: '#999' },
              ]}
            >
              {size}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>

    {selectedSize && (
      <Text style={{ marginTop: 8 }}>Selected Size: {selectedSize}</Text>
    )}
  </View>
)}


      {/* Actions */}
      <View style={{ marginTop: 20 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            onPress={() => {
              if (!selectedSize) {
                alert('Please select a size first!');
                return;
              }
              add(product._id, selectedSize);
            }}
            style={styles.button}
          >
            <Ionicons name="cart-outline" size={20} color="#fff" />
            <Text style={{ color: '#fff', marginLeft: 6 }}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              isInWishlist(product._id)
                ? removeFromWishlist(product._id)
                : addToWishlist(product._id)
            }
            style={[styles.button, styles.outlineButton]}
          >
            <Ionicons
              name={isInWishlist(product._id) ? "heart" : "heart-outline"}
              size={20}
              color={isInWishlist(product._id) ? "black" : "#000"}
            />
            <Text style={{ marginLeft: 6 }}>Wishlist</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.button, { marginTop: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: 'black' }]}>
          <Ionicons name="card-outline" size={20} color="black" />
          <Text style={{ color: 'black', marginLeft: 6 }}>Buy Now</Text>
        </TouchableOpacity>

        {/* Feature Icons */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
          <View style={styles.featureBox}>
            <MaterialIcons name="local-shipping" size={28} color="black" />
            <Text style={{ fontSize: 12, textAlign: 'center' }}>Priority Delivery</Text>
          </View>
          <View style={styles.featureBox}>
            <MaterialIcons name="swap-horiz" size={28} color="black" />
            <Text style={{ fontSize: 12, textAlign: 'center' }}>Easy Exchange</Text>
          </View>
          <View style={styles.featureBox}>
            <MaterialIcons name="payment" size={28} color="black" />
            <Text style={{ fontSize: 12, textAlign: 'center' }}>Cash on Delivery</Text>
          </View>
        </View>
      </View>

      {/* Accordion Section */}
      <View style={{ marginTop: 24 }}>
        {['Description', 'Product Code', 'Fit & Size', 'Additional Details'].map((title, idx) => (
          <View key={idx} style={styles.accordionItem}>
            <TouchableOpacity onPress={() => toggleAccordion(title)} style={styles.accordionHeader}>
              <Text style={{ fontWeight: '600' }}>{title}</Text>
              <Ionicons name={accordionOpen[title] ? "remove" : "add"} size={20} />
            </TouchableOpacity>
            {accordionOpen[title] && (
              <View style={styles.accordionContent}>
                <Text>
                  {title === 'Description' ? product.description :
                   title === 'Product Code' ? product.code || 'N/A' :
                   title === 'Fit & Size' ? product.fit || 'Standard Fit' :
                   product.additionalDetails || 'No details available.'}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Recommended / Similar Products */}
      <View style={{ marginTop: 24 }}>
        <Text style={{ fontWeight: '600', fontSize: 16, marginBottom: 12 }}>You Might Be Interested</Text>
        <FlatList
          data={product.similarProducts || []}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.recommendedItem}>
              <Image source={{ uri: item.image }} style={styles.recommendedImage} />
              <Text style={{ fontSize: 12, fontWeight: '500', marginTop: 4 }}>{item.title}</Text>
              <Text style={{ fontSize: 12, color: 'black' }}>₹{item.price}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700', color: '#111' },
  price: { fontSize: 16, fontWeight: '700', color: 'black' },
  description: { fontSize: 14, color: '#666', marginTop: 8 },
  discountBadge: { backgroundColor: 'black', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  thumbnail: { width: 60, height: 60, borderRadius: 6, borderWidth: 1, borderColor: '#ccc', marginRight: 8 },
  activeThumbnail: { borderColor: 'black', borderWidth: 2 },
  sizePill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#ccc', backgroundColor: '#fff' },
  selectedSize: { backgroundColor: 'black', borderColor: 'black', color: '#fff' },
  disabledSize: { backgroundColor: '#f0f0f0', borderColor: '#ccc' },
  button: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black', padding: 12, borderRadius: 10 },
  outlineButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: 'black' },
  offerBox: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 8 },
  featureBox: { justifyContent: 'center', alignItems: 'center', width: 100 },
  accordionItem: { borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 8 },
  accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  accordionContent: { paddingVertical: 8 },
  recommendedItem: { width: 120, marginRight: 12 },
  recommendedImage: { width: 120, height: 120, borderRadius: 8 },
  mainImage: {
    width,
    height: 400,
    borderRadius: 12,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeThumbnail: {
    borderWidth: 2,
    borderColor: 'black',
  },
});