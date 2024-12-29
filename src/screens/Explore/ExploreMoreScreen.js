import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window'); // Get screen width and height

const ExploreMoreScreen = () => {
  const navigation = useNavigation();

  // Sample data for the carousel (images and titles)
  const carouselItems = [
    { id: '1', title: 'Eventify', image: 'https://img.freepik.com/premium-photo/crowd-people-night-pool-party-ai-art_154797-1807.jpg?ga=GA1.1.1642102062.1730407199&semt=ais_hybrid' },
    { id: '2', title: 'Book Your Events', image: 'https://img.freepik.com/free-psd/new-year-celebration-post-social-media-template_505751-4866.jpg?ga=GA1.1.1642102062.1730407199&semt=ais_hybrid' },
    { id: '3', title: 'Dont Miss Any Cherish Event', image: 'https://img.freepik.com/free-vector/background-christmas-party_1048-162.jpg?ga=GA1.1.1642102062.1730407199&semt=ais_hybrid' },
  ];

  // Render carousel item
  const renderItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Image source={{ uri: item.image }} style={styles.carouselImage} />
      {/* Conditional styling for the first item */}
      {item.id === '1' ? (
        <View style={styles.textOverlay}>
          <Text style={styles.elegantText}>Eventify</Text>
        </View>
      ) : (
        <View style={styles.textOverlay}>
          <Text style={styles.carouselTitle}>{item.title}</Text>
        </View>
      )}
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
    backgroundColor: '#111', // Black background
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
    backgroundColor: 'rgba(7, 7, 7, 0.8)', // Semi-transparent black overlay
    paddingVertical: 20,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  elegantText: {
    fontSize: 50,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#008CBA', // Gold color for elegance
    textAlign: 'center',
    textShadowColor: '#000', // Subtle shadow for depth
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 45,
    letterSpacing: 2, // Elegant spacing
  },
  carouselTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#008CBA', // White text
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
    backgroundColor: '#008CBA',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 78, // Shadow for Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 56 },
    shadowOpacity: 0.9,
    shadowRadius: 55,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ExploreMoreScreen;


