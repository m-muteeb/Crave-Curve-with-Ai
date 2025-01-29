import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

const RestaurantDashboard = ({ navigation }) => (
  <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
      {/* Explore Menu Button */}
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate('AllProducts')}
      >
        <Text style={styles.exploreButtonText}>Explore Menu</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Restaurant Dashboard</Text>

      {/* Add Recipe Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('AddProduct')}
      >
        <ImageBackground
          source={{
            uri: 'https://img.freepik.com/free-photo/top-view-stuffed-eggplant-rolls-white-oval-plate-different-spices-notebook-grey-background_140725-111090.jpg?ga=GA1.1.609266300.1736801953&semt=ais_tags_boosted',
          }}
          style={styles.cardImage}
        >
          <Text style={styles.cardText}>Add Recipe</Text>
        </ImageBackground>
      </TouchableOpacity>

      {/* Manage Menu Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('EditProduct')}
      >
        <ImageBackground
          source={{
            uri: 'https://img.freepik.com/premium-photo/grilled-meat-skewers-chicken-shish-kebab-with-zucchini-tomatoes-red-onions-barbecue-food_2829-8116.jpg?ga=GA1.1.609266300.1736801953&semt=ais_tags_boosted',
          }}
          style={styles.cardImage}
        >
          <Text style={styles.cardText}>Manage Menu</Text>
        </ImageBackground>
      </TouchableOpacity>

      {/* Track Orders Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('SellerOrder')}
      >
        <ImageBackground
          source={{
            uri: 'https://img.freepik.com/premium-photo/hand-holding-plate-through-smartphone_99433-4751.jpg?ga=GA1.1.609266300.1736801953&semt=ais_tags_boosted',
          }}
          style={styles.cardImage}
        >
          <Text style={styles.cardText}>Track Orders</Text>
        </ImageBackground>
      </TouchableOpacity>

      {/* Search Recipe Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('SearchRecepie')}
      >
        <ImageBackground
          source={{
            uri: 'https://img.freepik.com/free-photo/man-hanging-out-with-robot_23-2151112171.jpg?ga=GA1.1.609266300.1736801953&semt=ais_tags_boosted',
          }}
          style={styles.cardImage}
        >
          <Text style={styles.cardText}>Create Recipe</Text>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'rgb(226, 226, 226)', // Light beige background
  },
  exploreButton: {
    backgroundColor: 'rgb(20, 16, 16)', // Warm red button
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    marginTop: 40,
  },
  exploreButtonText: {
    color: '#fff', // White text
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    color: 'rgb(20, 16, 16)', // Warm red for title
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 17, // Shadow for card
  },
  cardImage: {
    width: '100%',
    height: 150, // Card image height
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Fallback color
  },
  cardText: {
    color: '#fff', // White text
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent background
  },
});

export default RestaurantDashboard;
