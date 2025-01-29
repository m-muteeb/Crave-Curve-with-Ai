import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert, Modal, TextInput } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Cart = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    address: '',
    paymentMethod: '',
  });
  const [placeAllOrderModalVisible, setPlaceAllOrderModalVisible] = useState(false);

  // Fetch cart items on mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const response = await axios.get(`http://192.168.100.16:5000/api/cart?userId=${userId}`); // Fetch user-specific cart items
        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        Alert.alert('Error', 'Failed to fetch cart items');
      }
    };

    fetchCartItems();
  }, []);

  // Function to remove item from cart
  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`http://192.168.100.16:5000/api/cart/${itemId}`);
      setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
      Alert.alert('Removed', 'Item removed from cart.');
    } catch (error) {
      console.error('Error removing item:', error);
      Alert.alert('Error', 'Failed to remove item.');
    }
  };

  // Function to place an order for all items in the cart
  const handlePlaceAllOrder = async () => {
    if (!orderDetails.address || !orderDetails.paymentMethod) {
      Alert.alert('Incomplete Details', 'Please provide address and payment method.');
      return;
    }

    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await axios.post('http://192.168.100.16:5000/api/orders', {
        userId,
        cartItems,
        address: orderDetails.address,
        paymentMethod: orderDetails.paymentMethod,
      });

      if (response.status === 201) {
        setCartItems([]); // Clear local state after placing order
        setPlaceAllOrderModalVisible(false); // Close modal
        Alert.alert('Order Placed', 'Your order has been successfully placed.');
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place the order.');
    }
  };

  // Render each cart item
  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{item.productName}</Text>
        <Text style={styles.price}>${item.productPrice}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item._id)}
        >
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item._id}
            renderItem={renderCartItem}
          />
          <TouchableOpacity
            style={styles.orderButton}
            onPress={() => setPlaceAllOrderModalVisible(true)} // Show the modal to take order details
          >
            <Text style={styles.orderButtonText}>Place All Orders</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Modal for order details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={placeAllOrderModalVisible}
        onRequestClose={() => setPlaceAllOrderModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Order Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Address"
              placeholderTextColor="#aaa"
              value={orderDetails.address}
              onChangeText={(text) => setOrderDetails({ ...orderDetails, address: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Payment Method"
              placeholderTextColor="#aaa"
              value={orderDetails.paymentMethod}
              onChangeText={(text) => setOrderDetails({ ...orderDetails, paymentMethod: text })}
            />
            <TouchableOpacity
              style={styles.placeOrderButton}
              onPress={handlePlaceAllOrder}
            >
              <Text style={styles.placeOrderButtonText}>Place Order</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setPlaceAllOrderModalVisible(false)}
            >
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 10,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderColor: '#ffffff',
    borderWidth: 1,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderColor: '#ffffff',
    borderWidth: 1,
  },
  details: {
    marginLeft: 10,
    justifyContent: 'space-around',
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  price: {
    fontSize: 14,
    color: '#ffffff',
  },
  removeButton: {
    backgroundColor: '#FF6347',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  removeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 20,
  },
  orderButton: {
    backgroundColor: '#008CBA',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    color: '#008CBA',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f0f0f0',
    color: '#333',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  placeOrderButton: {
    backgroundColor: '#008CBA',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeModalButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  closeModalText: {
    color: '#008CBA',
    fontSize: 16,
  },
});

export default Cart;