import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';
import { HeightWContext } from '../contexts/HeightWContext';
import { ImpMetricContext } from '../contexts/ImpMetricContext'; // Import ImpMetricContext
import { Ionicons } from '@expo/vector-icons'; // Ensure you have the vector icons library installed

const MeasurementInputScreen = ({ navigation }) => {
  const { heightW, setHeightW } = useContext(HeightWContext);
  const { impmetric, setImpMetric } = useContext(ImpMetricContext); // Use ImpMetricContext

  const [weight, setWeight] = useState(heightW.weight || 70); // Default weight in kg

  useEffect(() => {
    if (!impmetric) {
      setImpMetric('metric');
    }
  }, [impmetric, setImpMetric]);

  const handleNext = () => {
    setHeightW((prevHeightW) => ({ ...prevHeightW, weight }));
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'HeightSelection' }],
      })
    );
  };

  const handleUnitSwitch = (unit) => {
    setImpMetric(unit);
    if (unit === 'imperial') {
      setWeight((prevWeight) => (prevWeight * 2.20462).toFixed(1)); // Convert kg to lbs
    } else {
      setWeight((prevWeight) => (prevWeight / 2.20462).toFixed(1)); // Convert lbs to kg
    }
  };

  const goBack = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'WorkoutCount' }],
      })
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
          <Ionicons name="arrow-back" size={24} color="#001F3F" />
        </TouchableOpacity>
        <Image
          source={require('../assets/weightselectionpic1.png')} // Make sure to add a relevant image
          style={styles.image}
        />
        <View style={styles.card}>
          <ProgressBar progress={0.3} color="#001F3F" style={styles.progressBar} />
          <Text style={styles.header}>Your Current Weight</Text>
          <Text style={styles.subHeader}>You are using {impmetric} units</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter your weight"
            placeholderTextColor="#A0A0A0"
            value={weight.toString()}
            onChangeText={text => {
              const parsedWeight = parseFloat(text);
              if (!isNaN(parsedWeight)) {
                setWeight(parsedWeight);
              }
            }}
            blurOnSubmit={true}
            onSubmitEditing={() => {
              // Optionally, you can add any additional logic you want to perform when the Enter key is pressed
            }}
          />
          <View style={styles.switchContainer}>
            <TouchableOpacity 
              style={impmetric === 'metric' ? styles.selectedUnitButton : styles.unitButton} 
              onPress={() => handleUnitSwitch('metric')}
            >
              <Text style={impmetric === 'metric' ? styles.selectedUnitText : styles.unitText}>kg</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={impmetric === 'imperial' ? styles.selectedUnitButton : styles.unitButton} 
              onPress={() => handleUnitSwitch('imperial')}
            >
              <Text style={impmetric === 'imperial' ? styles.selectedUnitText : styles.unitText}>lb</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>NEXT</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 5,
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    color: '#001F3F',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: '#001F3F',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 10,
    color: '#001F3F',
    marginBottom: 20,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  unitButton: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 50,
    zIndex: 1,
  },
  selectedUnitButton: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#001F3F',
    borderRadius: 10,
    alignItems: 'center',
  },
  image: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
    paddingBottom: 20,
  },
  unitText: {
    color: '#A0A0A0',
    fontSize: 16,
  },
  selectedUnitText: {
    color: '#FFFFFF',
    fontSize: 16,
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
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    padding: 5,
  },
});

export default MeasurementInputScreen;
