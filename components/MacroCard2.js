import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';

//This is for the previous days

const MacroCard = ({ name, calories, protein, fat, carbs, time, imageUri, onRemove }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.time}>{time}</Text>
        <Text style={styles.calories}>
          <FontAwesome5 name="fire" size={14} color="#FB8500" /> {calories} calories
        </Text>
        <View style={styles.macros}>
          <Text style={styles.macro}>
            <FontAwesome5 name="drumstick-bite" size={14} color="#FF6347" /> {protein}g
          </Text>
          <Text style={styles.macro}>
            <FontAwesome5 name="bread-slice" size={14} color="#F4A460" /> {carbs}g
          </Text>
          <Text style={styles.macro}>
            <FontAwesome5 name="cheese" size={14} color="#3CB371" /> {fat}g
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    marginVertical: 10,
    position: 'relative',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  time: {
    fontSize: 12,
    color: '#888888',
  },
  calories: {
    fontSize: 14,
    color: '#FB8500',
    marginVertical: 5,
  },
  macros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macro: {
    fontSize: 14,
    color: '#666666',
  },
  trashIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default MacroCard;
