import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { GenderContext } from '../contexts/GenderContext';
import { GoalContext } from '../contexts/GoalSelection';
import { AgeContext } from '../contexts/AgeContext';
import { HeightWContext } from '../contexts/HeightWContext';
import { WorkoutContext } from '../contexts/WorkoutContext';
import { CalorieContext } from '../contexts/CalorieContext';
import { FatContext } from '../contexts/FatContext';
import { ProteinContext } from '../contexts/ProteinContext';
import { CarbsContext } from '../contexts/CarbsContext';
import { CommonActions } from '@react-navigation/native';
import { EmailContext } from '../contexts/EmailContext';
import { ImpMetricContext } from '../contexts/ImpMetricContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const DescribeMeal = ({ navigation }) => {
  const { gender } = useContext(GenderContext);
  const { age } = useContext(AgeContext);
  const { goal } = useContext(GoalContext);
  const { heightW } = useContext(HeightWContext);
  const { workout } = useContext(WorkoutContext);
  const { calories, setCalories } = useContext(CalorieContext);
  const { fat, setFat } = useContext(FatContext);
  const { carbs, setCarbs } = useContext(CarbsContext);
  const { protein, setProtein } = useContext(ProteinContext);
  const { globalemail, setEmail } = useContext(EmailContext); // Make sure to change this
  const [mealDescription, setMealDescription] = useState('');
  const [macroCard, setMacroCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [mealData, setMealData] = useState({
    foodName: '',
    calories: 0,
    fat: 0,
    carbs: 0,
    protein: 0,
  });

  const goBack = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'HomeScreen' }],
      })
    );
  };

  const handleDescribeMeal = async () => {
    const messageDescribe = `I recently ate a dish and I need help identifying it and its nutritional information. Here is the description of the food I ate: ${mealDescription}. Can you provide the name of the food, the amount of protein, carbs, fat, and the total number of calories in it. Make sure the numbers that are provided are specific down to the one's place. This needs to be accurate since people's livelihood and happiness results on this. By all means MAKE SURE THAT THE FORMAT IS "1.FoodName: 2.Calories: 3.Protein: 4. Fat: 5.Carbs:?`;

    try {
      const response = await axios.post('https://us-central1-flirtx-5696f.cloudfunctions.net/gptfunc/track-meal', {
        model: 'gpt-4o',
        message: messageDescribe,
      });
      console.log('Response data:', response.data); // Log the response data
      const { foodName, calories, fat, carbs, protein } = response.data.data;

      // Return the meal data directly
      return { foodName, calories, fat, carbs, protein };
    } catch (error) {
      console.error('Error fetching macro data:', error);
      throw error;
    }
  };

  const addFoodToDatabase = async (userId, foodName, calories, protein, carbs, fat) => {
    const currentDate = new Date().toLocaleString(); // Get the current date in a readable format

    console.log('Data to be added to database:', { userId, foodName, calories, protein, carbs, fat, date: currentDate }); // Log the data being added

    try {
      const response = await fetch('https://us-central1-metrix-ai-afc04.cloudfunctions.net/firestorefunc/addTextFood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, foodName, calories, protein, carbs, fat, date: currentDate }),
      });

      if (response.ok) {
        const responseData = await response.text();
        console.log('Food added successfully:', responseData);
        return responseData;
      } else {
        const responseData = await response.text();
        Alert.alert('Failed to process food', 'Please try again.');
        // console.error('Error adding food:', responseData);
        // throw new Error('Failed to add food');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Handle the meal description submission
      const mealData = await handleDescribeMeal();

      // Destructure mealData to get individual variables
      const { foodName, calories, protein, carbs, fat } = mealData;

      // Log the meal data
      console.log('Meal data:', { foodName, calories, protein, carbs, fat });

      // Add food to the database
      await addFoodToDatabase(globalemail, foodName, calories, protein, carbs, fat);

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'HomeScreen' }],
        })
      );

      console.log('Meal Description:', mealDescription);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <MaterialIcons name="arrow-back" size={24} color="#001F3F" />
      </TouchableOpacity>
      <View style={styles.moveDown}>
        <Text style={styles.title}>Describe Your Meal</Text>
        <TextInput
            style={styles.input}
            placeholder="Type what you ate..."
            placeholderTextColor="#aaa"
            multiline
            value={mealDescription}
            onChangeText={setMealDescription}
        />
      </View>
      {isLoading ? (
        <View>
        <ActivityIndicator size="large" color="#001F3F" />
        <Text style={styles.loadingText}>Calculating Macros...</Text>
        </View>
      ) : (
        <>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity> */}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#001F3F',
    marginBottom: 20,
    textAlign: 'center',
  },
  moveDown:
  {
    paddingTop: 30
  },
  input: {
    height: 300,
    borderColor: '#001F3F',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top', // Ensures text starts at the top of the TextInput
    marginBottom: 20,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#001F3F',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 25,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    color: '#001F3F',
  },
});

export default DescribeMeal;
