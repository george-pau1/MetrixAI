import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { DateContext } from '../contexts/DateContext';

// Helper function to format the date
const formatDate = (date) => {
  const month = date.getMonth() + 1; // Months are 0-based
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
};

const Calendar = ({ navigation }) => {
  const currentDate = new Date();
  const yesterday = new Date();
  yesterday.setDate(currentDate.getDate() - 1);
  const dayBeforeYesterday = new Date();
  dayBeforeYesterday.setDate(currentDate.getDate() - 2);
  
  const { date, setDateDay } = useContext(DateContext);

  const daysToShow = [
    { date: dayBeforeYesterday, label: dayBeforeYesterday.toLocaleString('default', { weekday: 'long' }) },
    { date: yesterday, label: yesterday.toLocaleString('default', { weekday: 'long' }) },
    { date: currentDate, label: 'Today' },
  ];

  const handleNext = (selectedDate) => {
    try {
      // Format the selected date
      const formattedDate = formatDate(selectedDate);
  
      // Update the context value with the formatted date string
      setDateDay(formattedDate); // Directly call setDateDay without a promise
  
      // Use setTimeout to delay the navigation slightly
      setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: formattedDate === formatDate(new Date()) ? 'HomeScreen' : 'PreviousDays' }],
          })
        );
      }, 0); // Delay for 0 milliseconds to ensure the state update is processed
    } catch (error) {
      console.error('Error in handleNext:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      {daysToShow.map((day, index) => (
        <TouchableOpacity 
          key={index} 
          style={[
            styles.dayContainer, 
            index === 2 && styles.currentDayContainer // Highlight today's container
          ]}
          onPress={() => handleNext(day.date)}
        >
          {/* <Text style={[styles.monthText, index === 2 && styles.currentDayText]}>{day.date.toLocaleString('default', { month: 'long' })}</Text> */}
          <Text style={[styles.dateNumberText, index === 2 && styles.currentDayText]}>{day.date.getDate()}</Text>
          <Text style={[
            styles.dayText, 
            index === 2 && styles.currentDayText // Highlight today's text
          ]}>{day.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  dayContainer: {
    width: '28%',
    margin: 5,
    padding: 5,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  currentDayContainer: {
    backgroundColor: '#001F3F',
    borderColor: '#001F3F',
  },
  monthText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  dateNumberText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  dayText: {
    fontSize: 12,
    color: '#333',
  },
  currentDayText: {
    color: '#fff',
    // fontWeight: 'bold',
  },
});

export default Calendar;
