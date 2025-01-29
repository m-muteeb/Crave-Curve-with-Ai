import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  ActivityIndicator,
  Image,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';

import { SPOONACULAR_API_KEY } from '@env';

const { width: viewportWidth } = Dimensions.get('window');

const RecipeSearchByIngredients = () => {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [cookingTips, setCookingTips] = useState('');
  const [ingredientWarnings, setIngredientWarnings] = useState('');
  const [missedIngredientsWarning, setMissedIngredientsWarning] = useState('');
  const [relatedRecipes, setRelatedRecipes] = useState([]);
  const scrollViewRef = useRef();
  const [carouselIndex, setCarouselIndex] = useState(0);

  const carouselImages = [
    'https://img.freepik.com/free-photo/ordinary-human-job-performed-by-robot_23-2151008329.jpg?ga=GA1.1.609266300.1736801953&semt=ais_hybrid',
    'https://img.freepik.com/free-photo/close-up-anthropomorphic-robot-cooking_23-2150865929.jpg?ga=GA1.1.609266300.1736801953&semt=ais_hybrid',
    'https://img.freepik.com/premium-photo/cute-robot-cook-prepares-healthy-vegetarian-stir-fry-with-freshly-chopped-vegetables_674594-2278.jpg?ga=GA1.1.609266300.1736801953&semt=ais_hybrid',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollViewRef.current.scrollTo({
      x: carouselIndex * viewportWidth,
      animated: true,
    });
  }, [carouselIndex]);

  // Fetch recipes by ingredients
  const fetchRecipesByIngredients = async () => {
    if (!ingredients) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&apiKey=${SPOONACULAR_API_KEY}`
      );
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      setError('Failed to fetch recipes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite
  const toggleFavorite = (recipe) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(recipe.id)
        ? prevFavorites.filter((id) => id !== recipe.id)
        : [...prevFavorites, recipe.id]
    );
  };

  // Fetch detailed recipe info and related AI functionalities
  const fetchRecipeDetails = async (recipeId) => {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}`
      );
      const data = await response.json();
      setSelectedRecipe(data);

      // Fetch additional AI-based details
      evaluateIngredientSuitability(data.extendedIngredients);
      provideCookingTips(data.cuisines[0]);
      checkMissedIngredients(data.missedIngredients);
      fetchRelatedRecipes(data.id);
    } catch (error) {
      console.error(error);
    }
  };

  // Evaluate ingredient suitability
  const evaluateIngredientSuitability = (ingredients) => {
    const allergenicIngredients = ['nuts', 'dairy', 'gluten'];
    const unsuitable = ingredients.filter((item) =>
      allergenicIngredients.some((allergen) =>
        item.name.toLowerCase().includes(allergen)
      )
    );

    if (unsuitable.length > 0) {
      setIngredientWarnings(
        `⚠️ Contains potential allergens: ${unsuitable.map((item) => item.name).join(', ')}`
      );
    } else {
      setIngredientWarnings('✅ Ingredients are generally safe.');
    }
  };

  // Provide cooking tips
  const provideCookingTips = (cuisine) => {
    const tips = {
      Italian: 'Use fresh herbs like basil and oregano for authentic flavor.',
      Chinese: 'Cook on high heat for stir-fries to retain crispiness.',
      Indian: 'Toast spices before using for enhanced aroma.',
    };
    setCookingTips(tips[cuisine] || 'Experiment with fresh ingredients for the best results!');
  };

  // Check missed ingredients
  const checkMissedIngredients = (missedIngredients) => {
    if (missedIngredients && missedIngredients.length > 0) {
      setMissedIngredientsWarning(
        `⚠️ You are missing the following ingredients: ${missedIngredients.map((item) => item.name).join(', ')}`
      );
    } else {
      setMissedIngredientsWarning('');
    }
  };

  // Fetch related recipes
  const fetchRelatedRecipes = async (recipeId) => {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${recipeId}/similar?apiKey=${SPOONACULAR_API_KEY}`
      );
      const data = await response.json();
      setRelatedRecipes(data);
    } catch (error) {
      console.error('Failed to fetch related recipes', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Carousel */}
      <ScrollView
        horizontal
        pagingEnabled
        ref={scrollViewRef}
        style={styles.carousel}
        scrollEnabled={false}
      >
        {carouselImages.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.carouselImage} />
        ))}
      </ScrollView>

      {/* Input */}
      <TextInput
        placeholder="Enter ingredients (comma separated)"
        value={ingredients}
        onChangeText={setIngredients}
        style={styles.input}
      />

      {/* Search Button */}
      <Button title="What should I cook?" onPress={fetchRecipesByIngredients} color="#E50914" />

      {/* Loading Indicator */}
      {loading && <ActivityIndicator size="large" style={styles.loading} color="#E50914" />}

      {/* Error */}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* Recipe List */}
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.recipeCard}>
            <Text style={styles.recipeTitle}>{item.title}</Text>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.recipeImage} />
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, favorites.includes(item.id) ? styles.favoriteButton : styles.addButton]}
                onPress={() => toggleFavorite(item)}
              >
                <Text style={styles.buttonText}>
                  {favorites.includes(item.id) ? 'Remove from Favorites ❤️' : 'Add to Favorites'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.detailsButton]}
                onPress={() => fetchRecipeDetails(item.id)}
              >
                <Text style={styles.buttonText}>View Recipe Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal for Recipe Details */}
      {selectedRecipe && (
        <Modal visible={true} animationType="slide" onRequestClose={() => setSelectedRecipe(null)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedRecipe.title}</Text>
            <Image source={{ uri: selectedRecipe.image }} style={styles.modalImage} />
            <Text style={styles.modalSubtitle}>Ingredients:</Text>
            <FlatList
              data={selectedRecipe.extendedIngredients || []}
              keyExtractor={(item) => item.id?.toString()}
              renderItem={({ item }) => <Text>• {item.original}</Text>}
            />
            <Text style={styles.modalSubtitle}>Instructions:</Text>
            <ScrollView style={styles.instructionsContainer}>
              <Text>{selectedRecipe.instructions || 'No instructions provided.'}</Text>
            </ScrollView>
            <Text style={styles.modalSubtitle}>Nutritional Info:</Text>
            {selectedRecipe.nutrition && (
              <>
                <Text>Calories: {selectedRecipe.nutrition.nutrients[0]?.amount} kcal</Text>
                <Text>Fat: {selectedRecipe.nutrition.nutrients[1]?.amount} g</Text>
                <Text>Protein: {selectedRecipe.nutrition.nutrients[2]?.amount} g</Text>
              </>
            )}
            <Text style={styles.warning}>{ingredientWarnings}</Text>
            <Text style={styles.warning}>{missedIngredientsWarning}</Text>
            <Text style={styles.tips}>{cookingTips}</Text>
            <Text style={styles.modalSubtitle}>Related Recipes:</Text>
            <FlatList
              data={relatedRecipes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => fetchRecipeDetails(item.id)}>
                  <Text>• {item.title}</Text>
                </TouchableOpacity>
              )}
            />
            <Button title="Close" onPress={() => setSelectedRecipe(null)} color="#E50914" />
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
 

  container: {
    padding: 20,
    backgroundColor: '#000',
    color: '#fff',
  },
  carousel: {
    marginBottom: 20,
  },
  carouselImage: {
    width: viewportWidth,
    height: 200,
    borderRadius: 65,
  },
  input: {
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    color: '#000',
  },
  loading: {
    marginTop: 20,
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  recipeCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 20,
    borderRadius: 35,
    shadowColor: '#000',
    shadowOpacity: 0.9,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 9,
    marginTop: 10,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E50914',
    marginBottom: 10,
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 65,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    borderRadius: 75,
  },
  addButton: {
    backgroundColor: '#E50914',
  },
  favoriteButton: {
    backgroundColor: '#f44336',
  },
  detailsButton: {
    backgroundColor: '#000',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
   
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E50914',
    marginBottom: 15,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 75,
    marginBottom: 15,
  },
  modalSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E50914',
    marginTop: 10,
    marginBottom: 5,
  },
  instructionsContainer: {
    maxHeight: 200,
    marginBottom: 10,
    color: '#fff',
  },
  warning: {
    color: '#f44336',
    marginTop: 10,
    fontWeight: 'bold',
  },
  tips: {
    color: '#2ecc71',
    marginTop: 10,
    fontWeight: 'bold',
  },
});

export default RecipeSearchByIngredients;
