import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window'); // Get screen width and height

const ExploreMoreScreen = () => {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // Sample data for the carousel (images and titles)
  const carouselItems = [
    { id: '1', title: 'Crave Curve', image: 'https://img.freepik.com/free-photo/fried-chicken-breast-with-vegetables_140725-4649.jpg?ga=GA1.1.609266300.1736801953&semt=ais_hybrid' },
    { id: '2', title: 'Create Your Own Recepie with Ai', image: 'https://img.freepik.com/premium-photo/delicious-rice-meat-salad-plate-with-restaurant-blurred-background_7023-1342.jpg?ga=GA1.1.609266300.1736801953&semt=ais_hybrid' },
    { id: '3', title: 'Order anything to vanish your hunger', image: 'https://img.freepik.com/premium-photo/stuffed-peppers-with-rice-beans-pumpkin-mexican-style_2829-4944.jpg?ga=GA1.1.609266300.1736801953&semt=ais_hybrid' },
  ];

  // Automatically move the carousel every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= carouselItems.length) {
          return 0;
        }
        return nextIndex;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: currentIndex, animated: true });
    }
  }, [currentIndex]);

  // Render carousel item
  const renderItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Image source={{ uri: item.image }} style={styles.carouselImage} />
      <View style={styles.textOverlay}>
        <Text style={item.id === '1' ? styles.elegantText : styles.carouselTitle}>{item.title}</Text>
      </View>
    </View>
  );

  // Navigate to the Register Screen
  const handleExploreMore = () => {
    navigation.navigate('RegisterScreen'); // Navigate to Register Screen
  };

  return (
    <View style={styles.container}>
      {/* Fullscreen Carousel */}
      <FlatList
        ref={flatListRef}
        data={carouselItems}
        renderItem={renderItem}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        pagingEnabled // Snap to each full screen carousel item
      />

      {/* Explore More Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleExploreMore}>
          <Text style={styles.buttonText}>Explore More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background
  },
  carouselItem: {
    width: width, // Fullscreen width
    height: height, // Fullscreen height
    position: 'relative',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Cover entire screen
  },
  textOverlay: {
    position: 'absolute',
    top: '50%', // Center vertically
    left: 0,
    right: 0,
    transform: [{ translateY: -30 }], // Offset for perfect centering
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black overlay
    paddingVertical: 20,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  elegantText: {
    fontSize: 50,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#fff', // White color for elegance
    textAlign: 'center',
    textShadowColor: '#000', // Subtle shadow for depth
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 45,
    letterSpacing: 2, // Elegant spacing
  },
  carouselTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff', // White text
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#000', // White background
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 5, // Shadow for Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff', // Black text
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ExploreMoreScreen;