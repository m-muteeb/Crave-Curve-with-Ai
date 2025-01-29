import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import axios from "axios";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://192.168.100.16:5000/api/orders'); // Fetch all orders
        setOrders(response.data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Error fetching orders";
        setError(errorMessage);
        Alert.alert("Error", errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders(); // Fetch orders when the component mounts
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => {
      if (order._id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    setOrders(updatedOrders); // Update the orders array with the new status
    Alert.alert('Success', `Order status updated to ${newStatus}`);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0d6efd" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderOrder = ({ item, index }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderNumber}>Order #{index + 1}</Text>
      <Image
        source={{ uri: item.productImage }}
        style={styles.productImage}
        resizeMode="cover"
      />
      <Text style={styles.orderText}>
        <Text style={styles.label}>Order ID:</Text> {item._id}
      </Text>
      <Text style={styles.orderText}>
        <Text style={styles.label}>Product Name:</Text> {item.productName}
      </Text>
      <Text style={styles.orderText}>
        <Text style={styles.label}>Price:</Text> ${item.productPrice}
      </Text>
      <Text style={styles.orderText}>
        <Text style={styles.label}>Status:</Text> {item.status}
      </Text>
      <Text style={styles.orderText}>
        <Text style={styles.label}>User:</Text> {item.userDetails.name}
      </Text>
      <Text style={styles.orderText}>
        <Text style={styles.label}>Address:</Text> {item.userDetails.address}
      </Text>
      <Text style={styles.orderText}>
        <Text style={styles.label}>Phone:</Text> {item.userDetails.phone}
      </Text>
      <Text style={styles.orderText}>
        <Text style={styles.label}>Order Date:</Text> {new Date(item.orderDate).toLocaleString()}
      </Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#28a745" }]} // Green for Accept
          onPress={() => handleStatusChange(item._id, 'Accepted')}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#dc3545" }]} // Red for Reject
          onPress={() => handleStatusChange(item._id, 'Rejected')}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item._id}
      renderItem={renderOrder}
      contentContainerStyle={styles.container}
      ListHeaderComponent={<Text style={styles.headerText}>All Orders</Text>}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f4f4f9",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#0d6efd",
    marginTop: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#343a40",
  },
  orderCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    marginBottom: 16,
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#0d6efd", // Blue accent color on the left side
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    transform: [{ translateX: 0 }, { translateY: 3 }],
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#495057",
    marginBottom: 10,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#495057",
    lineHeight: 22,
  },
  label: {
    fontWeight: "600",
    color: "#0d6efd", // Blue for labels
  },
  productImage: {
    width: "100%",
    height: 200,
    marginBottom: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#e1e1e1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 18,
    color: "#dc3545",
    textAlign: "center",
  },
});

export default OrdersList;
