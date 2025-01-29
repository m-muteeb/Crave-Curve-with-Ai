import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';

const AddProduct = ({ navigation }) => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle image upload
  const handleImageUpload = () => {
    launchImageLibrary({ mediaType: 'photo', includeBase64: false }, (response) => {
      if (response.didCancel || response.errorCode) return;
      setImage(response.assets[0].uri);
    });
  };

  // Input validation
  const validateInputs = () => {
    if (!productName || !price || !description || !category || !restaurantName || !image) {
      return 'All fields and image are required.';
    }
    if (isNaN(price) || price <= 0) {
      return 'Price must be a positive number.';
    }
    return null;
  };

  // Handle adding product
  const handleAddProduct = async () => {
    const errorMessage = validateInputs();
    if (errorMessage) {
      Alert.alert('Error', errorMessage);
      return;
    }

    setLoading(true);

    // Prepare form data
    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('restaurantName', restaurantName);
    formData.append('image', {
      uri: image,
      type: 'image/jpeg',
      name: 'product.jpg',
    });

    try {
      const response = await axios.post('http://192.168.100.16:5000/api/createProducts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Log response for debugging
      console.log(response.data);

      // Check for successful response (status 201 for created)
      if (response.status === 201) {
        Alert.alert('Success', 'Product added successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Unexpected server response. Please try again.');
      }
    } catch (error) {
      console.error('Error adding product:', error);

      // Handle different types of errors
      if (error.response) {
        // Server responded with a status other than 2xx
        Alert.alert('Error', error.response.data.message || 'Failed to add product. Please try again.');
      } else if (error.request) {
        // No response from server
        Alert.alert('Error', 'No response from server. Please check your network and try again.');
      } else {
        // Something went wrong while setting up the request
        Alert.alert('Error', 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Product Name"
          value={productName}
          onChangeText={setProductName}
        />
        <TextInput
          style={styles.input}
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
        />
        <TextInput
          style={styles.input}
          placeholder="Restaurant Name"
          value={restaurantName}
          onChangeText={setRestaurantName}
        />
        <TouchableOpacity style={styles.imageUploadButton} onPress={handleImageUpload}>
          <Text style={styles.imageUploadButtonText}>Upload Image</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
            <Text style={styles.buttonText}>Add Product</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  imageUploadButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  imageUploadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default AddProduct;
