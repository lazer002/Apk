// src/components/Marquee.js
import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function Marquee() {
  const scrollX = useRef(new Animated.Value(0)).current;

  const messages = [
    { text: 'ORDERS SHIP WITHIN ', highlight: '24 HOURS', highlightColor: '#E58C6F' },
    { text: 'FREE 7DAY RETURNS', highlight: '', highlightColor: '' },
    { text: 'MADE IN INDIA', highlight: ' FOR THE WORLD', highlightColor: '#FFFFFF' },
    { text: 'FLAT 10% OFF ON FIRST PURCHASE USE CODE: ', highlight: 'APP10', highlightColor: '#E58C6F' },
  ];

  // Repeat manually in JSX
  const renderMessages = () => {
    const repeated = [];
    for (let i = 0; i < 10; i++) { // repeat 10 times
      messages.forEach((msg, idx) => {
        repeated.push(
          <Text key={`${i}-${idx}`} style={styles.message}>
            <Text style={{ color: '#FFFFFF' }}>{msg.text}</Text>
            {msg.highlight ? <Text style={{ color: msg.highlightColor }}>{msg.highlight}</Text> : null}
            {'  //  '}
          </Text>
        );
      });
    }
    return repeated;
  };

  useEffect(() => {
    const totalWidth = messages.length * 10 * 200; // approximate total width, adjust 200 as avg width of message
    const duration = 200000; // 20s per full scroll

    Animated.loop(
      Animated.timing(scrollX, {
        toValue: -totalWidth,
        duration,
        useNativeDriver: true,
        easing: t => t,
      })
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{ flexDirection: 'row', transform: [{ translateX: scrollX }] }}
      >
        {renderMessages()}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#1F2937',
    paddingVertical: 6,
  },
  message: {
    fontSize: 12,
    textTransform: 'uppercase',
    marginRight: 16,
  },
});
