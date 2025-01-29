import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Image, Modal, TextInput, ActivityIndicator } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios'; // For making API requests

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://192.168.100.16:5000/api/readProducts'); // Fetch all products
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        Alert.alert('Error', 'Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteProduct = async (product) => {
    Alert.alert('Delete Product', 'Are you sure you want to delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            // Delete the product from MongoDB using the _id
            await axios.delete(`http://192.168.100.16:5000/api/deleteProducts/${product._id}`);
  
            // Filter out the deleted product from the local state
            setProducts(products.filter((p) => p._id !== product._id));
            Alert.alert('Success', 'Product deleted successfully!');
          } catch (error) {
            console.error('Error deleting product:', error);
            Alert.alert('Error', 'Failed to delete product.');
          }
        },
      },
    ]);
  };

  const handleEditProduct = async (product) => {
    setCurrentProduct(product);
    setNewImage(product.imageUrl);
    setModalVisible(true);
  };

  const handleImageUpload = () => {
    launchImageLibrary({ mediaType: 'photo', includeBase64: false }, (response) => {
      if (response.didCancel || response.errorCode) return;
      setNewImage(response.assets[0].uri);
    });
  };

  const uploadImageToStorage = async (uri) => {
    // You need a backend or cloud storage like AWS S3, Google Cloud Storage to handle image uploads
    const filename = `products/${Date.now()}_${Math.random()}.jpg`;

    try {
      // Here, we simulate the image upload process (replace with actual backend call)
      const imageUrl = 'https://your-backend.com/path/to/uploaded/image.jpg';
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSaveChanges = async () => {
    setSaving(true);

    try {
      const updatedProduct = { ...currentProduct };

      // If a new image is selected, upload it to your storage and get the URL
      if (newImage && newImage !== currentProduct.imageUrl) {
        // Simulate image upload
        const imageUrl = await uploadImageToStorage(newImage);
        updatedProduct.imageUrl = imageUrl;
      }

      // Update the product details in MongoDB
      await axios.put(`http://192.168.100.16:5000/api/updateProducts/${currentProduct._id}`, updatedProduct);

      // Update the local state
      setProducts(products.map((product) => (product._id === currentProduct._id ? updatedProduct : product)));

      Alert.alert('Success', 'Product updated successfully!');
      setModalVisible(false);
      setCurrentProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      Alert.alert('Error', 'Failed to update product.');
    } finally {
      setSaving(false);
    }
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} resizeMode="cover" />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>Price: ${item.price}</Text>
      <Text style={styles.productDescription}>{item.description}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => handleEditProduct(item)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleDeleteProduct(item)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Products</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : products.length === 0 ? (
        <Text style={styles.emptyMessage}>No products found</Text>
      ) : (
        <FlatList data={products} renderItem={renderProductItem} keyExtractor={(item) => item._id} />
      )}

      {currentProduct && (
        <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Product</Text>
            <TextInput
              style={styles.input}
              placeholder="Product Name"
              value={currentProduct.name}
              onChangeText={(text) => setCurrentProduct({ ...currentProduct, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={currentProduct.price.toString()}
              keyboardType="numeric"
              onChangeText={(text) => setCurrentProduct({ ...currentProduct, price: parseFloat(text) })}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={currentProduct.description}
              onChangeText={(text) => setCurrentProduct({ ...currentProduct, description: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Category"
              value={currentProduct.category}
              onChangeText={(text) => setCurrentProduct({ ...currentProduct, category: text })}
            />
            {newImage && <Image source={{ uri: newImage }} style={styles.image} />}
            <TouchableOpacity style={styles.imageButton} onPress={handleImageUpload}>
              <Text style={styles.imageButtonText}>Change Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[ styles.saveButton]} onPress={handleSaveChanges} disabled={saving}>
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Changes</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  productImage: {
    width: 130,
    height: 130,
    borderRadius: 12,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 2,
  },
  productName: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    color: '#00796b',
    fontSize: 16,
    marginBottom: 10,
  },
  productDescription: {
    color: '#666',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 4, // Reduced padding for smaller size
    paddingHorizontal: 8,
    borderRadius: 8,
    flex: 0.45,
    alignItems: 'center',
    marginBottom: 10,
  }, imageButton: {
    backgroundColor: '#00796b',
    paddingVertical: 6,  // Reduced padding for smaller size
    paddingHorizontal: 10,  // Reduced padding for smaller size
    borderRadius: 6,  // Slightly smaller border radius for better proportion
    alignItems: 'center',
    marginBottom: 8,  // Reduced margin for smaller spacing
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 14,  // Smaller font size
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,  // Consistent font size across buttons
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#00796b',
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
  },
  emptyMessage: {
    fontSize: 16,  // Slightly reduced font size for consistency
    color: '#333',
    textAlign: 'center',
    marginTop: 16,  // Slightly reduced top margin
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 18,  // Reduced padding for a more compact design
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 22,  // Slightly reduced font size
    fontWeight: 'bold',
    marginBottom: 12,  // Reduced margin for better spacing
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,  // Slightly smaller radius for a sleeker look
    padding: 8,  // Reduced padding for smaller input fields
    marginBottom: 12,  // Reduced bottom margin
  },
  image: {
    width: 150,  // Enlarged image size
    height: 150,  // Enlarged image size
    borderRadius: 12,  // Slightly rounded for a sleek look
    marginBottom: 20,  // Increased bottom margin for better spacing
    alignSelf: 'center',  // Centers the image horizontally
 
  },
  saveButton: {
    backgroundColor: 'rgb(0, 0, 0)',  // Red color
    paddingVertical: 14,  // Reduced padding for smaller size
    paddingHorizontal: 15,  // Reduced padding for smaller size
    borderRadius: 6,  // Slightly smaller border radius for better proportion
    alignItems: 'center',
    marginBottom: 8,  // Reduced margin for smaller spacing
  },
  cancelButton: {
    backgroundColor: 'rgb(255, 13, 13)',  // Red color
    paddingVertical: 6,  // Reduced padding for smaller size
    paddingHorizontal: 10,  // Reduced padding for smaller size
    borderRadius: 6,  // Slightly smaller border radius for better proportion
    alignItems: 'center',
    marginBottom: 8,  // Reduced margin for smaller spacing
  },
});


  export default ManageProducts;