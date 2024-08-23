import React, { useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
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

const AfterSurvey = ({ navigation }) => {
  const { gender } = useContext(GenderContext);
  const { age } = useContext(AgeContext);
  const { goal } = useContext(GoalContext);
  const { heightW } = useContext(HeightWContext);
  const { workout } = useContext(WorkoutContext);
  const { setCalories } = useContext(CalorieContext);
  const { setFat} = useContext(FatContext)
  const { setCarbs} = useContext(CarbsContext)
  const { protein,setProtein} = useContext(ProteinContext)
  const {setEmail} = useContext(EmailContext) // Make sure to change this
  const {impmetric} = useContext(ImpMetricContext)

  useEffect(() => {
    const timer = setTimeout(() => {
        navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'CreateAccount' }],
            })
          );
    }, 6000);

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [navigation]);

  useEffect(() => {
    const sendMessage = async () => {
        
        const message = `Estimate with maximum accuracy the daily calorie intake and macronutrient requirements for a human with the following attributes:

        Gender: ${gender}
        Age: ${age} years
        Height: ${heightW.height}
        Weight: ${heightW.weight}
        Measurement System: ${impmetric}
        If it's imperial, use inches and pounds, if metric, use cm and kg
        Workout: ${workout} (specify type, frequency, and intensity)
        Goal: ${goal} (either "bulk" for muscle gain or "cut" for fat loss)
        For a bulking goal, assume the person wants to gain muscle mass. For a cutting goal, assume the person aims to lose fat.
        
        Consider the following factors in your calculations:
        
        Basal Metabolic Rate (BMR): The number of calories required to maintain basic bodily functions at rest.
        Total Daily Energy Expenditure (TDEE): The total number of calories burned in a day, including all activities and exercise.
        Macronutrient Distribution: Provide the optimal amounts of carbohydrates, fats, and proteins in grams per day.
        The response should be formatted strictly as follows and include only the numerical values:
        
        "Daily Calories: X kcal, Carbs: Y grams, Fat: Z grams, Protein: W grams."
        
        No additional information or explanation should be provided. Ensure the accuracy of the calculations by considering all relevant factors.`;
        console.log(message)
        try {
          const response = await axios.post('https://us-central1-flirtx-5696f.cloudfunctions.net/gptfunc/give-rizz', {
            model: 'gpt-4o',
            message: message,
          });
          
          // Check if response.data is a string
          let responseData = response.data;
          
          if (typeof responseData === 'object') {
            // Convert object to string for regex processing
            responseData = JSON.stringify(responseData);
          }
          
          // Use a regular expression to extract numeric values from the response
          const numericValues = responseData.match(/\d+(\.\d+)?/g);
          
          if (numericValues && numericValues.length > 0) {
            // Assuming the first numeric value is the calorie value we need
            const calorieValue = parseFloat(numericValues[0]);
            await setCalories(calorieValue); // Store the numeric value in the CaloriesContext
            const carbsValue = parseFloat(numericValues[1]);
            await setCarbs(carbsValue);
            const fatValue = parseFloat(numericValues[2]);
            await setFat(fatValue)
            const proteinValue = parseFloat(numericValues[3]);
            await setProtein(proteinValue)


            ////MAKE SURE TO CHANGE THIS LATER
     //       await setEmail('this.gmail.com')
     
            console.log(protein)

          } else {
            console.error('No numeric values found in the response.');
          }
        } catch (error) {
          console.error('Error sending message:', error);
        }
      };

    sendMessage();
  }, [gender, age, goal, heightW, workout, setCalories]);

  return (
    <View style={styles.container}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#001F3F" />
        <Text style={styles.loadingText}>Processing your answers...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    loadingContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 18,
      color: '#001F3F', // Accent color
      marginTop: 20,
      fontWeight: 'bold',
    },
  });

export default AfterSurvey;
