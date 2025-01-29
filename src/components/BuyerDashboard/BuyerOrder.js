import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const BuyerOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://192.168.100.16:5000/api/orders'); // Fetch all orders
        setOrders(response.data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Error fetching orders';
        setError(errorMessage);
        Alert.alert('Error', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders(); // Fetch orders when the component mounts
  }, []);

  const handleRemoveOrder = async (orderId) => {
    try {
      await axios.delete(`http://192.168.100.16:5000/api/orders/${orderId}`);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
      Alert.alert('Success', 'Order removed successfully');
    } catch (error) {
      console.error('Error removing order:', error);
      Alert.alert('Error', 'Failed to remove order');
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Image source={{ uri: item.productImage }} style={styles.orderItemImage} />
      <View style={styles.orderItemDetails}>
        <Text style={styles.orderItemName}>{item.productName}</Text>
        <Text style={styles.orderItemPrice}>${item.productPrice}</Text>
        <Text style={styles.orderItemDate}>
          Date: {new Date(item.orderDate).toLocaleDateString()}
        </Text>
       
       
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        <Text style={styles.noOrdersText}>You haven't placed any orders yet!</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.orderList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
    fontSize: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff6347',
    fontSize: 18,
  },
  orderList: {
    paddingBottom: 20,
  },
  orderItem: {
    flexDirection: 'row',
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderColor: '#ffffff',
    borderWidth: 1,
  },
  orderItemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  orderItemDetails: {
    marginLeft: 10,
    justifyContent: 'center',
    flex: 1,
  },
  orderItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  orderItemPrice: {
    fontSize: 16,
    color: '#ffffff',
  },
  orderItemDate: {
    fontSize: 14,
    color: '#ffffff',
  },
  orderItemStatus: {
    fontSize: 14,
    color: '#ffffff',
  },
  removeButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noOrdersText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default BuyerOrder;