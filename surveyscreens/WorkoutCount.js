import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';
import { WorkoutContext } from '../contexts/WorkoutContext';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have the vector icons library installed

const WorkoutFrequencyScreen = ({ navigation }) => {
  const { workout, setWorkout } = useContext(WorkoutContext);
  const [selectedFrequency, setSelectedFrequency] = useState(workout || null);

  const goBack = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'GenderSelection' }],
      })
    );
  };

  const handleSelectFrequency = (frequency) => {
    setSelectedFrequency(frequency);
    setWorkout(frequency);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MeasurementInput' }],
      })
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
          <Ionicons name="arrow-back" size={24} color="#001F3F" />
        </TouchableOpacity>
        <Text style={styles.header}>How many workouts?</Text>
        <ProgressBar progress={0.2} color="#001F3F" style={styles.progressBar} />
        <Text style={styles.subHeader}>Select how often you plan to work out each week.</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/workoutselectionpic2.jpeg')} // Add your image path here
          style={styles.image}
        />
      </View>

      <View style={styles.card}>
        {['1-2', '3-4', '5+'].map(frequency => (
          <TouchableOpacity
            key={frequency}
            style={[
              styles.button,
              selectedFrequency === frequency && styles.selectedButton
            ]}
            onPress={() => handleSelectFrequency(frequency)}
          >
            <Text
              style={[
                styles.buttonText,
                selectedFrequency === frequency && styles.selectedButtonText
              ]}
            >
              {frequency}
            </Text>
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
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 30,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 16,
    color: '#001F3F', // Very dark navy blue
  },
  header: {
    fontSize: 26,
    color: '#001F3F', // Very dark navy blue
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 30,
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 5,
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 18,
    color: '#001F3F', // Very dark navy blue
    textAlign: 'center',
    marginBottom: 30,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
  },
  card: {
    width: '100%',
    padding: 20,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#DDDDDD',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  selectedButton: {
    backgroundColor: '#001F3F', // Very dark navy blue for selected state
  },
  buttonText: {
    fontSize: 18,
    color: '#001F3F', // Very dark navy blue
    fontWeight: 'bold',
  },
  selectedButtonText: {
    color: '#FFFFFF', // White text for selected state
  },
});

export default WorkoutFrequencyScreen;
