import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

const EventManagementDashboard = ({ navigation }) => (
  <View style={styles.container}>
    {/* Explore Events Button */}
    <TouchableOpacity
      style={styles.exploreButton}
      onPress={() => navigation.navigate('AllProducts')}
    >
      <Text style={styles.exploreButtonText}>Explore Events</Text>
    </TouchableOpacity>

    <Text style={styles.title}>Event Management Dashboard</Text>

    {/* Create Event Card */}
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('AddProduct')}
    >
      <ImageBackground
        source={{ uri: 'https://img.freepik.com/free-photo/creative-lightbulb-idea-with-copy-space_23-2148610091.jpg' }}
        style={styles.cardImage}
      >
        <Text style={styles.cardText}>Create Event</Text>
      </ImageBackground>
    </TouchableOpacity>

    {/* Manage Events Card */}
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('EditProduct')}
    >
      <ImageBackground
        source={{ uri: 'https://img.freepik.com/free-photo/event-management-business-teamwork-concept_1098-15274.jpg' }}
        style={styles.cardImage}
      >
        <Text style={styles.cardText}>Manage Events</Text>
      </ImageBackground>
    </TouchableOpacity>

    {/* Track Bookings Card */}
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('SellerOrder')}
    >
      <ImageBackground
        source={{ uri: 'https://img.freepik.com/free-photo/top-view-table-with-reservation-booking_23-2149286307.jpg' }}
        style={styles.cardImage}
      >
        <Text style={styles.cardText}>Track Bookings</Text>
      </ImageBackground>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#E8F5E9', // Light greenish background
  },
  exploreButton: {
    backgroundColor: '#008CBA', // Blue button
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  exploreButtonText: {
    color: '#fff', // White text
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    color: '#008CBA', // Blue for title
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5, // Shadow for card
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background
  },
});

export default EventManagementDashboard;
