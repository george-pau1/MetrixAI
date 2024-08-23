import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Text, Pressable } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';

export default function Footer({ navigation, onScanFoodPress, onSavedFoodsPress }) {
  const [modalVisible, setModalVisible] = useState(false);

  const goDescribeMealScreen = () => {
    closeModal();
    setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'DescribeMeal' }],
        })
      );
    }, 300); // Add a delay before navigating
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleScanFoodPress = () => {
    closeModal();
    setTimeout(() => {
      onScanFoodPress();
    }, 300); // Add a delay before opening the camera
  };

  const handleSavedFoodsPress = () => {
    closeModal();
    setTimeout(() => {
      onSavedFoodsPress();
    }, 300); // Add a delay before calling the function
  };

  const toggleModal = () => {
    if (!modalVisible) {
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
        >
        <Pressable style={styles.modalOverlay} onPress={closeModal}>
            <View style={styles.modalContainer} pointerEvents="box-none">
            {/* <TouchableOpacity style={styles.iconButton} onPress={toggleModal}>
                <MaterialIcons name="add" size={24} color="#F7FAFC" />
            </TouchableOpacity> */}
            <Pressable style={styles.button} onPress={goDescribeMealScreen}>
                <MaterialIcons name="edit" size={24} color="#000" style={styles.icon} />
                <Text style={styles.buttonText}>Describe Food</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={handleSavedFoodsPress}>
                <MaterialIcons name="bookmark" size={24} color="#000" style={styles.icon} />
                <Text style={styles.buttonText}>Saved Foods</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={handleScanFoodPress}>
                <MaterialCommunityIcons name="barcode-scan" size={24} color="#000" style={styles.icon} />
                <Text style={styles.buttonText}>Scan Food</Text>
            </Pressable>
            </View>
        </Pressable>
      </Modal>

      <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
        <MaterialIcons name="add" size={24} color="#F7FAFC" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'transparent'
  },
  addButton: {
    position: 'absolute',
    top: -55,
    right: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 45,
    backgroundColor: '#001F3F',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  iconButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0B0F1A',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: 150,
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
