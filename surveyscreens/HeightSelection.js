import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, Image} from 'react-native';
import { ProgressBar, Button } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';
import { HeightWContext } from '../contexts/HeightWContext';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have the vector icons library installed

const HeightSelectionScreen = ({ navigation }) => {
  const { heightW, setHeightW } = useContext(HeightWContext);
  const [unitSystem, setUnitSystem] = useState('metric');
  const [heightMetric, setHeightMetric] = useState(170); // Default height in cm
  const [heightImperial, setHeightImperial] = useState({ feet: 5, inches: 9 }); // Default height in ft & in

  const [feetModalVisible, setFeetModalVisible] = useState(false);
  const [inchesModalVisible, setInchesModalVisible] = useState(false);

  const heightOptionsMetric = Array.from({ length: 151 }, (_, i) => 100 + i);
  const heightOptionsImperialFeet = Array.from({ length: 8 }, (_, i) => i + 3);
  const heightOptionsImperialInches = Array.from({ length: 12 }, (_, i) => i);

  const handleNext = () => {
    const height = unitSystem === 'metric' ? heightMetric : heightImperial;
    setHeightW(prevHeightW => ({
        ...prevHeightW,
        height
      }));
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'AgeSelection' }],
      })
    );
  };

  const goBack = () => {
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
        <ProgressBar progress={0.5} color="#001F3F" style={styles.progressBar} />
        <Text style={styles.header}>How Tall Are You?</Text>
        <Text style={styles.subHeader}>The taller you are, the more calories your body needs.</Text>
      </View>

      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[styles.unitButton, unitSystem === 'metric' && styles.activeUnitButton]}
          onPress={() => setUnitSystem('metric')}
        >
          <Text style={[styles.unitButtonText, unitSystem === 'metric' && styles.activeUnitButtonText]}>m & cm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.unitButton, unitSystem === 'imperial' && styles.activeUnitButton]}
          onPress={() => setUnitSystem('imperial')}
        >
          <Text style={[styles.unitButtonText, unitSystem === 'imperial' && styles.activeUnitButtonText]}>ft & in</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        {unitSystem === 'metric' ? (
            <View> 
            <Image
            source={require('../assets/heightselectionpic1.jpeg')} // Make sure to add a relevant image
            style={styles.image1}
            />
          <TouchableOpacity onPress={() => setFeetModalVisible(true)} style={styles.picker}>
            <Text style={styles.pickerText}>{heightMetric} cm</Text>
          </TouchableOpacity>
          </View>
        ) : (
          <>
            <Image
            source={require('../assets/heightselectionpic1.jpeg')} // Make sure to add a relevant image
            style={styles.image2}
            />
            <TouchableOpacity onPress={() => setFeetModalVisible(true)} style={styles.picker}>
              <Text style={styles.pickerText}>{heightImperial.feet} ft</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setInchesModalVisible(true)} style={styles.picker}>
              <Text style={styles.pickerText}>{heightImperial.inches} in</Text>
            </TouchableOpacity>
          </>
        )}
        
      </View>
      

      <Modal
        visible={feetModalVisible}
        transparent={true}
        onRequestClose={() => setFeetModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={unitSystem === 'metric' ? heightOptionsMetric : heightOptionsImperialFeet}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {
                  if (unitSystem === 'metric') {
                    setHeightMetric(item);
                  } else {
                    setHeightImperial((prev) => ({ ...prev, feet: item }));
                  }
                  setFeetModalVisible(false);
                }}>
                  <Text style={styles.modalItem}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <Button onPress={() => setFeetModalVisible(false)}>Close</Button>
          </View>
        </View>
      </Modal>

      <Modal
        visible={inchesModalVisible}
        transparent={true}
        onRequestClose={() => setInchesModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={heightOptionsImperialInches}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {
                  setHeightImperial((prev) => ({ ...prev, inches: item }));
                  setInchesModalVisible(false);
                }}>
                  <Text style={styles.modalItem}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <Button onPress={() => setInchesModalVisible(false)}>Close</Button>
          </View>
        </View>
      </Modal>

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
  headerContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 5,
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 30,
    zIndex: 1,
  },
  header: {
    fontSize: 24,
    color: '#001F3F',
    fontWeight: 'bold',
    marginBottom: 10,
  },
//   image: {
//     width: 350,
//     height: 350,
//     resizeMode: 'contain',
//   },
  image1: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
    paddingTop: 50,
    marginBottom: 55
  },
  image2: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
    paddingBottom: 10,
    marginBottom: 20
  },
  subHeader: {
    fontSize: 16,
    color: '#555555',
    textAlign: 'center',
    marginBottom: 30,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  unitButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#001F3F',
    alignItems: 'center',
  },
  activeUnitButton: {
    backgroundColor: '#001F3F',
  },
  unitButtonText: {
    fontSize: 18,
    color: '#001F3F',
  },
  activeUnitButtonText: {
    color: '#FFFFFF',
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#001F3F',
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
  },
  pickerText: {
    fontSize: 18,
    color: '#001F3F',
    textAlign: 'center',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginBottom: 10
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 30,
    borderRadius: 10,
    padding: 20,
    maxHeight: '70%',
  },
  modalItem: {
    padding: 15,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default HeightSelectionScreen;
