import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';
import { GoalContext } from '../contexts/GoalSelection';
import { ImpMetricContext } from '../contexts/ImpMetricContext';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have the vector icons library installed

const GoalSelectionScreen = ({ navigation }) => {
  const { goal, setGoal } = useContext(GoalContext);
  const [selectedGoal, setSelectedGoal] = useState(goal);
  const { impmetric, setImpMetric } = useContext(ImpMetricContext);

  const handleGoalSelection = (goalOption) => {
    setSelectedGoal(goalOption);
    setGoal(goalOption);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'AfterSurvey' }],
      })
    );
  };


  const goBack = () => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'GenderSelection' }],
        })
      );
    };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
          <Ionicons name="arrow-back" size={24} color="#001F3F" />
        </TouchableOpacity>
        <ProgressBar progress={0.5} color="#001F3F" style={styles.progressBar} />
        <Text style={styles.header}>Select Your Goal</Text>
        <Text style={styles.subHeader}>Choose what you want to achieve.</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/goalselectionpic1.jpeg')} // Replace with your actual image path
          style={styles.image}
        />
      </View>

      <View style={styles.buttonContainer}>
        {['Lose Weight', 'Maintain Weight', 'Gain Weight'].map(goalOption => (
          <TouchableOpacity
            key={goalOption}
            style={[
              styles.button,
              selectedGoal === goalOption && styles.selectedButton
            ]}
            onPress={() => handleGoalSelection(goalOption)}
          >
            <Text style={styles.buttonText}>{goalOption}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-start',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 30,
    zIndex: 1,
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 5,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    color: '#001F3F', // Accent color
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: '#001F3F', // Accent color
    textAlign: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 10, // Reduced marginBottom to move buttons up
  },
  image: {
    width: 450, // Adjust the width as needed
    height: 450, // Adjust the height as needed
    resizeMode: 'contain',
  },
  buttonContainer: {
    width: '100%',
    paddingBottom: 20
  },
  button: {
    width: '100%',
    padding: 20,
    marginVertical: 5, // Reduced marginVertical to move buttons up
    backgroundColor: '#DDDDDD',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BBBBBB',
  },
  selectedButton: {
    backgroundColor: '#001F3F', // Accent color for selected state
    borderColor: '#001F3F',
  },
  buttonText: {
    fontSize: 18,
    color: '#001F3F', // Accent color
  },
});

export default GoalSelectionScreen;
