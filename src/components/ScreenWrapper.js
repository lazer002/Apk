// src/components/ScreenWrapper.js
import React from 'react';
import {  View, StyleSheet } from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
export default function ScreenWrapper({ children }) {
  return (
    <SafeAreaView style={styles.safe}>
      
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1,},
});
