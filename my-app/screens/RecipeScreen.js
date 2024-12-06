import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// Function to clean HTML tags from a string
const stripHtmlTags = (html) => {
  return html.replace(/<[^>]*>/g, '');  // Strips HTML tags
};

const Tab = createMaterialTopTabNavigator();

function RecipeOverview({ recipe }) {
  // Clean the HTML tags from the summary using regular expression
  const cleanSummary = stripHtmlTags(recipe.summary);

  return (
    <View style={styles.overviewContainer}>
      <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
      <Text style={styles.recipeTitle}>{recipe.title}</Text>
      {/* Wrap clean summary in a <Text> component */}
      <Text style={styles.recipeSummary}>{cleanSummary}</Text>
    </View>
  );
}

function RecipeInstructions({ steps }) {
  return (
    <View style={styles.stepsContainer}>
      <FlatList
        data={steps}
        keyExtractor={(item) => item.number.toString()}
        renderItem={({ item }) => (
          <View style={styles.stepRow}>
            <Text style={styles.stepNumber}>{item.number}</Text>
            <Text style={styles.stepDescription}>{item.step}</Text>
          </View>
        )}
      />
    </View>
  );
}

export default function RecipeScreen({ route }) {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    fetchRecipeDetails();
  }, []);

  const fetchRecipeDetails = async () => {
    try {
      const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, {
        params: {
          apiKey: '919490a42afa4341b520e346287de3e0', // Your actual API key
        },
      });
      setRecipe(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!recipe) {
    return <Text>Loading...</Text>;
  }

  return (
    <Tab.Navigator>
      <Tab.Screen name="Overview">
        {() => <RecipeOverview recipe={recipe} />}
      </Tab.Screen>
      <Tab.Screen name="Instructions">
        {() => <RecipeInstructions steps={recipe.analyzedInstructions[0]?.steps || []} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  overviewContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recipeSummary: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 15,
  },
  stepsContainer: {
    padding: 10,
    backgroundColor: '#fff',
  },
  stepRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 30,
    textAlign: 'center',
    color: '#FF6F00', // Orange color
  },
  stepDescription: {
    fontSize: 16,
    flex: 1,
    paddingLeft: 10,
    color: '#333',
  },
});
