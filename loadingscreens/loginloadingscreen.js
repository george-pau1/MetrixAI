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

const LoginLoadingScreen = ({ navigation }) => {
    const { calories, setCalories } = useContext(CalorieContext);
    const { fat, setFat} = useContext(FatContext)
    const { carbs, setCarbs} = useContext(CarbsContext)
    const { protein,setProtein} = useContext(ProteinContext)
    const {globalemail, setEmail} = useContext(EmailContext) // Make sure to change this

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'HomeScreen' }],
                })
              );
        }, 2000);
    
        return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }, [navigation]);
    
    useEffect(() => {
        (async () => {
          try {
            const response = await fetch('https://us-central1-metrix-ai-afc04.cloudfunctions.net/firestorefunc/getDailyNutrients', {
              method: 'POST', // Use GET method as per the backend endpoint definition
              headers: {
                'Content-Type': 'application/json',
              },
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({globalemail}),
            });
    
            if (response.ok) {
              const responseData = await response.json();
              console.log('Daily nutrients fetched successfully:', responseData);
    
              // Update the context with the received data
              await setCalories(responseData.dailycalories);
              await setProtein(responseData.dailyprotein);
              await setCarbs(responseData.dailycarbs);
              await setFat(responseData.dailyfat);
            } else {
              const responseData = await response.text();
              console.error('Error fetching daily nutrients:', responseData);
              throw new Error('Failed to fetch daily nutrients');
            }
          } catch (error) {
            console.error('Error:', error);
            throw error;
          }
        })();
      }, [globalemail, setCalories, setProtein, setCarbs, setFat]);

    return (
        <View style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#001F3F" />
            <Text style={styles.loadingText}>Fetching Your Daily Macros...</Text>
          </View>
        </View>
      );
}

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

export default LoginLoadingScreen