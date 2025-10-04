// src/screens/CategoriesScreen.js
import { SafeAreaView } from 'react-native-safe-area-context';

import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const categories = ['T-Shirts', 'Jeans', 'Jackets', 'Shoes', 'Accessories'];

export default function CategoriesScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Categories</Text>
      {categories.map((cat, index) => (
        <TouchableOpacity
          key={index}
          style={styles.catCard}
          onPress={() => alert(`Show ${cat} products`)}
        >
          <Text style={styles.catText}>{cat}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  catCard: { backgroundColor: '#f2f2f2', padding: 20, borderRadius: 12, marginBottom: 12 },
  catText: { fontSize: 18 },
});
