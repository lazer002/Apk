// src/components/GlobalCartIcon.js
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';

export default function GlobalCartIcon() {
  const navigation = useNavigation();
  const { items } = useCart();
  const count = items?.length || 0;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('CartScreen')}
      style={{
        position: 'absolute',
        top: 45,
        right: 20,
        zIndex: 999,
        backgroundColor: '#fff',
        borderRadius: 30,
        padding: 8,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
      }}
    >
      <View style={{ position: 'relative' }}>
        <Ionicons name="cart-outline" size={28} color="#111" />
        {count > 0 && (
          <View
            style={{
              position: 'absolute',
              right: -6,
              top: -6,
              backgroundColor: '#FF6347',
              borderRadius: 8,
              paddingHorizontal: 5,
              paddingVertical: 1,
              minWidth: 16,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>
              {count}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
