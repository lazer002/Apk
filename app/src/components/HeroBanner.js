import React, { useState } from 'react';
import { View, Image, Dimensions, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';

const { width } = Dimensions.get('window');

const images = [
  require('../assets/banner1.jpg'),
  require('../assets/banner2.jpg'),
  require('../assets/banner3.jpg'),
];

export default function HeroBanner() {
  const [autoplayDirection, setAutoplayDirection] = useState(true); // true = forward

  return (
    <View style={styles.container}>
      <Swiper
        autoplay
        autoplayTimeout={2.5}
        loop={false} // disable default loop
        showsPagination
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        autoplayDirection={autoplayDirection ? true : false}
        onIndexChanged={(index) => {
          if (index === images.length - 1) setAutoplayDirection(false); // reverse at last
          if (index === 0) setAutoplayDirection(true); // forward at first
        }}
      >
        {images.map((img, index) => (
          <Image
            key={index}
            source={img}
            style={styles.image}
            resizeMode="cover"
          />
        ))}
      </Swiper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height: 200,
    // marginBottom: 16,
    // borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000', // prevent flicker
  },
  image: {
    width,
    height: 200,
  },
  dot: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#FF6347',
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },
});
