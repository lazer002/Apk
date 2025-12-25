// screens/BundlePLPScreen.jsx
import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, FlatList, Image,
  TouchableOpacity, Dimensions, Modal, Pressable, ScrollView
} from "react-native";
import Animated, { Layout } from "react-native-reanimated";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import api from "../utils/config";
import AppHeader from "../components/AppHeader";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

import SideFilterPanel from "../components/SideFilterPanel";

const { width } = Dimensions.get("window");
const SIZE_OPTIONS = ["S", "M", "L", "XL"];

export default function BundlePLPScreen({ navigation }) {
  const [bundles, setBundles] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [filterVisible, setFilterVisible] = useState(false);

  // active filters
  const [filters, setFilters] = useState({
    category: null,
    sizes: [],
    colors: [],
    price: null,
  });

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addBundleToCart } = useCart();

  /* load bundles */
  useEffect(() => {
    const fetchBundles = async () => {
      try {
        const res = await api.get("/api/bundles");
        setBundles(res.data.items);
      } catch (err) {
        console.log(err);
      }
    };
    fetchBundles();
  }, []);

  /* apply filters */
  const filteredBundles = bundles.filter((b) => {
    if (filters.category && b.categorySlug !== filters.category) return false;

    if (filters.price && b.price > filters.price) return false;

    if (filters.sizes.length > 0) {
      const bundleSizes = b.products.flatMap(p => p.availableSizes || []);
      if (!filters.sizes.some(size => bundleSizes.includes(size))) return false;
    }

    if (filters.colors.length > 0) {
      const bundleColors = b.products.flatMap(p => p.color || []);
      if (!filters.colors.some(color => bundleColors.includes(color))) return false;
    }

    return true;
  });

  /* wishlist toggle */
  const toggleWishlist = (id) =>
    isInWishlist(id) ? removeFromWishlist(id) : addToWishlist(id);

  /* open modal */
  const openModal = (bundle) => {
    setSelectedBundle(bundle);
    setSelectedSizes({});
    setModalVisible(true);
  };

  /* add bundle to cart */
  const handleAddToCart = async () => {
    const missing = selectedBundle.products.some(p => !selectedSizes[p._id]);
    if (missing) return alert("Select size for all items");

    await addBundleToCart(selectedBundle, selectedSizes);
    setModalVisible(false);
  };

  /* CARD UI */
  const BundleCard = ({ item }) => {
    const img = item.mainImages[0];
    const productCount = item.products.length;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.card,
          viewMode === "list" && styles.cardList
        ]}
        onPress={() => navigation.navigate("BundleDetailsScreen", { bundleId: item._id })}
      >
        <Image
          source={{ uri: img }}
          style={viewMode === "grid" ? styles.imageGrid : styles.imageList}
        />

        {/* wishlist */}
        <TouchableOpacity style={styles.wishlistIcon} onPress={() => toggleWishlist(item._id)}>
          {isInWishlist(item._id)
            ? <Ionicons name="heart-sharp" size={22} color="#fff" />
            : <Ionicons name="heart-outline" size={22} color="#fff" />}
        </TouchableOpacity>

        {/* info */}
        <View style={styles.infoBox}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>

          {/* bundle item previews */}
          <View style={styles.thumbRow}>
            {item.products.slice(0, 4).map(p => (
              <Image
                key={p._id}
                source={{ uri: p.images[0] }}
                style={styles.thumbImg}
              />
            ))}
            {productCount > 4 && (
              <View style={styles.thumbMore}>
                <Text style={styles.thumbMoreTxt}>+{productCount - 4}</Text>
              </View>
            )}
          </View>

          <Text style={styles.subtitle}>{productCount} items</Text>
          <Text style={styles.price}>₹{item.price}</Text>

          <TouchableOpacity style={styles.quickBtn} onPress={() => openModal(item)}>
            <Text style={styles.quickTxt}>QUICK ADD</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      <AppHeader title="Bundles" />

      {/* toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <Ionicons name="filter-outline" size={22} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
          {viewMode === "grid"
            ? <MaterialIcons name="view-agenda" size={26} color="#000" />
            : <MaterialIcons name="grid-view" size={26} color="#000" />}
        </TouchableOpacity>
      </View>

      <Animated.View layout={Layout} style={{ flex: 1 }}>
        <FlatList
          data={filteredBundles}
          renderItem={({ item }) => <BundleCard item={item} />}
          key={viewMode}
          numColumns={viewMode === "grid" ? 2 : 1}
          columnWrapperStyle={viewMode === "grid" ? { justifyContent: "space-between" } : null}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 80 }}
        />
      </Animated.View>

      {/* SIDE FILTER PANEL */}
      <SideFilterPanel
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        filters={filters}
        setFilters={setFilters}
      />

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{selectedBundle?.title}</Text>

            <ScrollView style={{ maxHeight: 350 }}>
              {selectedBundle?.products.map((p) => (
                <View key={p._id} style={styles.modalItem}>
                  <Image source={{ uri: p.images[0] }} style={styles.modalImg} />

                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalItemTitle}>{p.title}</Text>

                    <View style={styles.sizeRow}>
                      {SIZE_OPTIONS.map(size => (
                        <TouchableOpacity
                          key={size}
                          style={[
                            styles.sizeBtn,
                            selectedSizes[p._id] === size && styles.sizeBtnActive
                          ]}
                          onPress={() =>
                            setSelectedSizes(prev => ({ ...prev, [p._id]: size }))
                          }
                        >
                          <Text style={[
                            styles.sizeTxt,
                            selectedSizes[p._id] === size && { color: "#fff" }
                          ]}>
                            {size}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.addCartBtn} onPress={handleAddToCart}>
              <Text style={styles.addCartTxt}>Add Bundle to Cart</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

/* === STYLES === */
const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:"#fff"},
  toolbar:{flexDirection:"row",justifyContent:"space-between",paddingHorizontal:16,paddingVertical:12,borderBottomWidth:1,borderColor:"#ddd"},

  /* grid layout */
  card:{backgroundColor:"#111",borderRadius:12,overflow:"hidden",marginBottom:12,marginHorizontal:6,width:(width/2)-18},
  cardList:{width:width-18,flexDirection:"row"},
  imageGrid:{width:"100%",height:(width/2)*1.35,resizeMode:"cover"},
  imageList:{width:(width/2)-18,height:width*0.9,resizeMode:"cover"},

  wishlistIcon:{position:"absolute",top:10,right:10,zIndex:10},
  infoBox:{padding:12},
  title:{fontSize:17,fontWeight:"800",color:"#fff"},
  subtitle:{fontSize:13,opacity:0.7,color:"#fff"},
  price:{fontSize:22,fontWeight:"900",marginVertical:4,color:"#fff"},

  /* thumb previews */
  thumbRow:{flexDirection:"row",marginVertical:6},
  thumbImg:{width:26,height:26,borderRadius:6,borderWidth:1,borderColor:"#fff",marginRight:-6},
  thumbMore:{width:26,height:26,borderRadius:6,backgroundColor:"#000",alignItems:"center",justifyContent:"center"},
  thumbMoreTxt:{color:"#fff",fontSize:12,fontWeight:"800"},

  quickBtn:{borderWidth:1,borderColor:"#fff",paddingVertical:6,borderRadius:8,alignItems:"center"},
  quickTxt:{fontWeight:"700",fontSize:14,color:"#fff"},

  overlay:{flex:1,backgroundColor:"rgba(0,0,0,0.4)",justifyContent:"center",padding:20},
  modalBox:{backgroundColor:"#fff",borderRadius:16,padding:16},
  modalTitle:{fontSize:20,fontWeight:"900",marginBottom:6},

  modalItem:{flexDirection:"row",gap:10,paddingVertical:12,borderBottomWidth:1,borderColor:"#eee"},
  modalImg:{width:60,height:60,borderRadius:8,borderWidth:1,borderColor:"#000"},
  modalItemTitle:{fontWeight:"700",fontSize:16},

  sizeRow:{flexDirection:"row",flexWrap:"wrap",gap:8,marginTop:6},
  sizeBtn:{borderWidth:1,borderColor:"#000",paddingVertical:4,paddingHorizontal:16,borderRadius:8},
  sizeBtnActive:{backgroundColor:"#000"},
  sizeTxt:{fontWeight:"800",color:"#000"},

  addCartBtn:{backgroundColor:"#000",paddingVertical:14,borderRadius:10,marginTop:16},
  addCartTxt:{color:"#fff",fontWeight:"900",fontSize:16,textAlign:"center"}
});
