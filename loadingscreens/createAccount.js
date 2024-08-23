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
import { DateContext } from '../contexts/DateContext';

const CreateAccount = ({ navigation }) => {
    const { gender } = useContext(GenderContext);
    const { age } = useContext(AgeContext);
    const { goal } = useContext(GoalContext);
    const { heightW } = useContext(HeightWContext);
    const { workout } = useContext(WorkoutContext);
    const { calories, setCalories } = useContext(CalorieContext);
    const { fat, setFat} = useContext(FatContext)
    const { carbs, setCarbs} = useContext(CarbsContext)
    const { protein,setProtein} = useContext(ProteinContext)
    const {globalemail, setEmail} = useContext(EmailContext) // Make sure to change this
    const {timezone, setTimeZone} = useContext(DateContext)
    

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'HomeScreen' }],
                })
              );
        }, 6000);
    
        return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }, [navigation]);
    
      useEffect(() => {
        const createAcount = async () => {
            let paidstatus = 0
            try {
                const response = await fetch('https://us-central1-metrix-ai-afc04.cloudfunctions.net/firestorefunc/create', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ globalemail, paidstatus, calories, protein, carbs, fat, timezone}),
                });
                console.log(response.data)
              } catch (error) {
                console.error('Error:', error);
                throw error;
              }
          };
    
        createAcount();
      }, [calories, carbs, protein, globalemail, fat]);

    return (
        <View style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#001F3F" />
            <Text style={styles.loadingText}>Customizing Your Account...</Text>
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

export default CreateAccount