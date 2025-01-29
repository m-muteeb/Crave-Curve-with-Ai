import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput, Dimensions, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartAdded, setCartAdded] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Screen dimensions for responsive layout
  const screenWidth = Dimensions.get('window').width;
  const columns = screenWidth > 600 ? 3 : 2;

  // Carousel ref for auto-scrolling
  const carouselRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0); // Track scroll position

  // Fetch products and categories from MongoDB
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://192.168.100.16:5000/api//readProducts');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
fetchProducts();
    

    // Auto-scroll the carousel
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const nextIndex = (Math.floor(scrollPosition / screenWidth) + 1) % 5; // Change 3 to the number of items
        carouselRef.current.scrollToIndex({ animated: true, index: nextIndex });
      }
    }, 2000); // Scroll every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [scrollPosition]);

  // Handle add to cart
  const handleAddToCart = async (product) => {
    if (cartAdded.includes(product._id)) {
      Alert.alert('Info', `${product.productName} is already in the cart`);
      return;
    }
  
    try {
      await axios.post('http://192.168.100.16:5000/api/cart', {
        productId: product._id, // Use the _id field from the product schema
        quantity: 1, // Default quantity
      });
  
      setCartAdded([...cartAdded, product._id]); // Update the state with the product's _id
      Alert.alert('Success', `${product.productName} added to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add product to cart');
    }
  };
  
  // Filter and sort products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Sorting the products based on the selected sort order
  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.price - b.price; // Ascending order
    } else {
      return b.price - a.price; // Descending order
    }
  });

  // Handle Bottom Tab navigation
  const handleTabPress = (tab) => {
    switch (tab) {
      case 'RecepieSearch':
        navigation.navigate('SearchRecepie');
        break;
      case 'Cart':
        navigation.navigate('Cart');
        break;
      case 'BuyerOrder': // Updated to match your file name
        navigation.navigate('BuyerOrder');
        break;
      default:
        break;
    }
  };

  // Handle FlatList onScroll to update scroll position
  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    setScrollPosition(contentOffsetX);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Carousel */}
      <FlatList
        ref={carouselRef}
        data={[
          { id: '1', uri: 'https://img.freepik.com/free-photo/person-using-ar-technology-their-daily-occupation_23-2151137301.jpg?ga=GA1.1.609266300.1736801953&semt=ais_hybrid' },
          { id: '2', uri: 'https://img.freepik.com/free-photo/delicious-burger-with-bright-light_23-2150902378.jpg?ga=GA1.1.609266300.1736801953&semt=ais_hybrid' },
          { id: '3', uri: 'https://img.freepik.com/premium-photo/cute-robot-cook-prepares-healthy-vegetarian-stir-fry-with-freshly-chopped-vegetables_674594-2279.jpg?ga=GA1.1.609266300.1736801953&semt=ais_hybrid' },
        ]}
        renderItem={({ item }) => (
          <View style={[styles.carouselContent, { width: screenWidth }]}>
            <Image source={{ uri: item.uri }} style={styles.carouselImage} />
            <Text style={styles.carouselText}>Crave Curve With Ai</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={screenWidth}
        decelerationRate="fast"
        pagingEnabled
        onScroll={handleScroll}
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoryButton, selectedCategory === item.id && styles.selectedCategory]}
            onPress={() => setSelectedCategory(item.id)}
          >
            <Image source={{ uri: item.iconUrl }} style={styles.categoryIcon} />
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        horizontal
        style={styles.categoryList}
      />

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortText}>Sort by:</Text>
        <TouchableOpacity onPress={() => setSortOrder('asc')} style={styles.sortButton}>
          <Text style={styles.sortButtonText}>Price: Low to High</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortOrder('desc')} style={styles.sortButton}>
          <Text style={styles.sortButtonText}>Price: High to Low</Text>
        </TouchableOpacity>
      </View>

      {/* Product List */}
      <FlatList
        data={sortedProducts}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
            <Text style={styles.productName}>{item.productName}</Text>
            <Text style={styles.productPrice}>${item.price}</Text>
            <TouchableOpacity
  style={styles.button}
  onPress={() => handleAddToCart(item)}
  disabled={cartAdded.includes(item._id)} 
> 
  <Text style={styles.buttonText}>
    {cartAdded.includes(item._id) ? 'Already Added to Cart' : 'Add to Cart'} 
  </Text>
</TouchableOpacity>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        numColumns={columns}
        contentContainerStyle={styles.productList}
      />

      {/* Bottom Tabs */}
      <View style={styles.bottomTabs}>
        <TouchableOpacity style={styles.tabButton} onPress={() => handleTabPress('RecepieSearch')}>
          <Text style={styles.tabText}>Create Recepie</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => handleTabPress('Cart')}>
          <Text style={styles.tabText}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => handleTabPress('BuyerOrder')}>
          <Text style={styles.tabText}>Orders</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    paddingBottom: 80, // Ensure space for bottom tab
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselContent: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  carouselText: {
    position: 'absolute',
    top: '50%',
    left: '58%',
    transform: [{ translateX: -167 }, { translateY: -50 }],
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: 'rgba(68, 66, 66, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: '#000',
    borderWidth: 1,
  },
  clearButton: {
    marginLeft: 10,
  },
  clearText: {
    color: '#000',
  },
  categoryList: {
    marginVertical: 10,
  },
  categoryButton: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryIcon: {
    width: 40,
    height: 40,
  },
  categoryText: {
    marginTop: 5,
    fontSize: 14,
    color: '#333',
  },
  selectedCategory: {
    borderBottomWidth: 2,
    borderBottomColor: '#008CBA',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  sortText: {
    fontSize: 16,
    marginRight: 10,
  },
  sortButton: {
    marginRight: 10,
    padding: 5,
    backgroundColor: '#000',
    borderRadius: 5,
  },
  sortButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  productList: {
    marginTop: 10,
    paddingBottom: 20, // Ensure space for bottom tabs
  },
  productCard: {
    flex: 1,
    margin: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 40,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 55, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  productImage: {
    width: '100%',         // Makes the image take up the full width of the container
    height: 200,          // Adjust the height as needed to fit the top of the card
    borderTopLeftRadius: 10,   // Optional: adds rounded corners on the top-left
    borderTopRightRadius: 45,  // Optional: adds rounded corners on the top-right
    objectFit: 'cover',
    borderRadius: 50,      // Ensures the image covers the entire area without distorting
  }, 
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  productPrice: {
    fontSize: 14,
    color: '#008CBA',
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  bottomTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  tabButton: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    color: '#000',
  },
});


export default AllProducts;