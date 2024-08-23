import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { GenderContext } from '../contexts/GenderContext';
import moment from 'moment-timezone';
import { DateContext } from '../contexts/DateContext';

const GenderSelectionScreen = ({ navigation }) => {
  const { gender, setGender } = useContext(GenderContext);
  const [selectedGender, setSelectedGender] = useState(gender);
  const { timeZone, setTimeZone } = useContext(DateContext);

  useEffect(() => {
    // Get the current time zone offset in hours
    const currentTimeZone = moment.tz.guess(); // Get the current time zone name
    const offset = moment.tz(currentTimeZone).utcOffset() / 60; // Get the offset in minutes and convert to hours
    setTimeZone(offset);
  }, []);

  const handleGenderSelection = (genderOption) => {
    setSelectedGender(genderOption);
    setGender(genderOption);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'WorkoutCount' }],
      })
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Get Started</Text>

      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/genderselectionpic1.jpeg')} // Make sure to add a relevant image
            style={styles.image}
          />
        </View>
        <Text style={styles.mainText}>
          Let's begin by creating a customized plan to help you reach your goals. Please select your gender, as this is essential for accurate calorie budget calculations.
        </Text>

        <View style={styles.buttonContainer}>
          {['Male', 'Female'].map(genderOption => (
            <TouchableOpacity
              key={genderOption}
              style={[
                styles.button,
                selectedGender === genderOption && styles.selectedButton
              ]}
              onPress={() => handleGenderSelection(genderOption)}
            >
              <Text
                style={[
                  styles.buttonText,
                  selectedGender === genderOption && styles.selectedButtonText
                ]}
              >
                {genderOption}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* <Text style={styles.timeZoneText}>Your Time Zone: UTC {timeZone >= 0 ? `+${timeZone}` : timeZone}</Text> */}
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
  header: {
    fontSize: 26,
    color: '#001F3F', // Very dark navy blue
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 30,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: 40,
  },
  image: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
  },
  mainText: {
    fontSize: 18,
    color: '#001F3F', // Very dark navy blue
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    marginHorizontal: 10,
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
  timeZoneText: {
    fontSize: 16,
    color: '#001F3F', // Very dark navy blue
    marginTop: 20,
  },
});

export default GenderSelectionScreen;
