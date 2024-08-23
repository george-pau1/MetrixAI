import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { CommonActions } from '@react-navigation/native';
import { AgeContext } from '../contexts/AgeContext';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have the vector icons library installed

const AgeSelectionScreen = ({ navigation }) => {
  const { age, setAge } = useContext(AgeContext);

  const handleNext = () => {
    if (age) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'GoalSelection' }],
        })
      );
    }
  };

  const goBack = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'HeightSelection' }],
      })
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
          <Ionicons name="arrow-back" size={24} color="#001F3F" />
        </TouchableOpacity>
        <ProgressBar progress={0.4} color="#001F3F" style={styles.progressBar} />
        <Text style={styles.header}>Select Your Age</Text>
        <Text style={styles.subHeader}>Use the slider to choose your age.</Text>
      </View>

      <Image
            source={require('../assets/ageselectionpic.jpeg')} // Make sure to add a relevant image
            style={styles.image}
      />

      <View style={styles.sliderContainer}>
        <Text style={styles.inputLabel}>Age: {Math.round(age)}</Text>
        <Slider
          value={age}
          onValueChange={value => setAge(value)}
          minimumValue={10}
          maximumValue={100}
          step={1}
          minimumTrackTintColor="#001F3F"
          maximumTrackTintColor="#B0B0B0"
          thumbTintColor="#003366"
          style={styles.slider}
        />
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 30,
    zIndex: 1,
  },
  headerContainer: {
    alignItems: 'center',
  },
  image: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
    marginTop:60
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 5,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    color: '#001F3F',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 30,
  },
  sliderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 18,
    color: '#001F3F',
    marginBottom: 10,
    textAlign: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  nextButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#001F3F',
    borderRadius: 10,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default AgeSelectionScreen;
