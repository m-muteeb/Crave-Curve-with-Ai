import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  FlatList,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ProductDetails = ({ route }) => {
  const { product } = route.params;
  const [cartAdded, setCartAdded] = useState(false);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    address: '',
    phone: '',
  });
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchComments();
  }, [product._id]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://192.168.100.16:5000/api/products/${product._id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddToCart = async () => {
    try {
      await axios.post('http://192.168.100.16:5000/api/cart', {
        productId: product._id, // Use the _id field from the product schema
        quantity: 1, // Default quantity
      });
      setCartAdded(true);
      Alert.alert('Success', 'Product added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add product to cart');
    }
  };

  const handleOrderProduct = async () => {
    const { name, address, phone } = userDetails;

    if (!name || !address || !phone) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    try {
      await axios.post('http://192.168.100.16:5000/api/orders', {
        productId: product._id,
        productName: product.productName,
        productPrice: product.price,
        userDetails,
        orderDate: new Date(),
        productImage: product.imageUrl,
        status: 'Pending',
      });

      setOrderModalVisible(false);
      Alert.alert('Success', 'Your order has been placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place the order.');
    }
  };

  const handleInputChange = (field, value) => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handleAddComment = async () => {
    if (!comment) {
      Alert.alert('Error', 'Comment cannot be empty.');
      return;
    }

    try {
      const newComment = { productId: product._id, text: comment };

      await axios.post(`http://192.168.100.16:5000/api/products/${product._id}/comments`, newComment);

      setComments([...comments, newComment]);
      setComment('');
      Alert.alert('Success', 'Comment added');
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
      <Text style={styles.productName}>{product.productName}</Text>
      <Text style={styles.productPrice}>${product.price}</Text>
      <Text style={styles.productDescription}>{product.description}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.cartButton]}
          onPress={handleAddToCart}
          disabled={cartAdded}
        >
          <Text style={styles.buttonText}>
            {cartAdded ? 'Added to Cart' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.orderButton]}
          onPress={() => setOrderModalVisible(true)}
        >
          <Text style={styles.buttonText}>Order Now</Text>
        </TouchableOpacity>
      </View>

      {/* Comments Section */}
      <View style={styles.commentsSection}>
        <Text style={styles.commentsTitle}>Comments</Text>
        {comments.length > 0 ? (
          <FlatList
            data={comments}
            keyExtractor={(item) => item._id} // Ensure each comment has a unique '_id'
            renderItem={({ item }) => (
              <View style={styles.commentContainer}>
                <Text style={styles.commentText}>{item.text}</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noCommentsText}>No comments yet.</Text>
        )}

        {/* Add Comment Section */}
        <TextInput
          style={styles.input}
          placeholder="Add a comment"
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity
          style={[styles.button, styles.addCommentButton]}
          onPress={handleAddComment}
        >
          <Text style={styles.buttonText}>Add Comment</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={orderModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setOrderModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Your Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={userDetails.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={userDetails.address}
              onChangeText={(value) => handleInputChange('address', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              keyboardType="phone-pad"
              value={userDetails.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
            />
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={handleOrderProduct}
            >
              <Text style={styles.modalButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setOrderModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  productPrice: {
    fontSize: 18,
    color: 'green',
    marginTop: 5,
  },
  productDescription: {
    fontSize: 16,
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  cartButton: {
    backgroundColor: 'black',
  },
  orderButton: {
    backgroundColor: 'black',
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  commentsSection: {
    marginTop: 30,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  commentContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  commentText: {
    fontSize: 16,
  },
  noCommentsText: {
    fontSize: 16,
    color: '#888',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  addCommentButton: {
    marginTop: 10,
    backgroundColor: 'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: 'black',
  },
  cancelButton: {
    backgroundColor: 'gray',
    marginTop: 10,
  },
});

export default ProductDetails;

