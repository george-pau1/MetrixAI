import React, { useEffect, useContext, useState, useMemo } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image, SafeAreaView, FlatList } from 'react-native';
import { Avatar } from 'react-native-paper';
import Svg, { Circle } from 'react-native-svg';
import PieChart from 'react-native-expo-pie-chart';
import { MaterialIcons } from '@expo/vector-icons';
import TopBar from '../components/TopBar';
import Calendar from '../components/Calendar';
import Footer from '../components/Footer';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import MacroCard from '../components/MacroCard2';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import axios from 'axios';

import { CalorieContext } from '../contexts/CalorieContext';
import { FatContext } from '../contexts/FatContext';
import { ProteinContext } from '../contexts/ProteinContext';
import { CarbsContext } from '../contexts/CarbsContext';
import { EmailContext } from '../contexts/EmailContext';
import { DateContext } from '../contexts/DateContext';

const PreviousDays = ({ navigation }) => {
    const { calories: calorieGoal, setCalories } = useContext(CalorieContext);
    const { fat: fatGoal, setFat } = useContext(FatContext);
    const { carbs: carbsGoal, setCarbs } = useContext(CarbsContext);
    const { protein: proteinGoal, setProtein } = useContext(ProteinContext);
    const { globalemail, setEmail } = useContext(EmailContext);
    const { date, setDate } = useContext(DateContext);

    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true); // State for loading

    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loadingResponse, setLoadingResponse] = useState(false);
    const [totalMacros, setTotalMacros] = useState('');

    const [macroCards, setMacroCards] = useState([]);
    const [fatConsumed, setFatConsumed] = useState(0);
    const [carbsConsumed, setCarbsConsumed] = useState(0);
    const [proteinConsumed, setProteinConsumed] = useState(0);
    const [caloriesConsumed, setCaloriesConsumed] = useState(0);

    const dailyMacros = {
        fat: { consumed: fatConsumed, goal: fatGoal },
        carbs: { consumed: carbsConsumed, goal: carbsGoal },
        protein: { consumed: proteinConsumed, goal: proteinGoal },
      };
    
      const macroData = [
        { key: 'Fat', count: dailyMacros.fat.consumed, color: '#FB8500' },
        { key: 'Carbs', count: dailyMacros.carbs.consumed, color: '#00A6FB' },
        { key: 'Protein', count: dailyMacros.protein.consumed, color: '#A0E426' },
      ];

      const MacroChart = ({ percentage, remainingGrams, label }) => {
        const displayValue = remainingGrams >= 0 ? `${remainingGrams}g` : `+${Math.abs(remainingGrams)}g`;
        const macroIcon = getMacroIcon(label);
        
        const color = useMemo(() => {
          switch (label.toLowerCase()) {
            case 'fat':
              // return "#F4A6A0";
              return "#E57373";
            case 'carbs':
             // return "#F9E1B6";
              return "#FFD54F";
            case 'protein':
           //   return "#B6D7A8";
              return "#81C784";
            default:
              return "#E0E0E0";
          }
        }, [label]);
      
        return (
          <View style={styles.macroChartContainer}>
            <AnimatedCircularProgress
              size={75}
              width={15}
              fill={percentage}
              tintColor={color}
              backgroundColor="#E0E0E0"
              lineCap="round"
              rotation={0}
            >
              {() => (
                <View style={styles.innerCircle}>
                  <MaterialIcons name={macroIcon} size={24} color={color} />
                  {/* <Text style={styles.gramsText}>{displayValue}</Text> */}
                </View>
              )}
            </AnimatedCircularProgress>
          </View>
        );
      };
      
      const getMacroIcon = (label) => {
        switch (label.toLowerCase()) {
          case 'fat':
            return 'opacity'; // Example icon for fat (can be adjusted)
          case 'carbs':
            return 'restaurant'; // Example icon for carbs (can be adjusted)
          case 'protein':
            return 'fitness-center'; // Example icon for protein (can be adjusted)
          default:
            return 'help-outline'; // Default icon for unknown labels
        }
      };


    const CaloriesPieChart = ({ caloriesConsumed, calorieGoal }) => {
        const percentage = (caloriesConsumed / calorieGoal) * 100;
        const roundedPercentage = percentage > 100 ? 'Over' : Math.round(percentage);
      
        return (
          <View style={styles.pieChartContainer}>
            <AnimatedCircularProgress
              size={225}
              width={35}
              fill={percentage}
              tintColor="#001F3F"
              backgroundColor="#E0E0E0"
              lineCap="round"
              rotation={0}
            >
              {() => (
                <View style={styles.innerCircle}>
                  {/* <Text style={styles.percentageText}>{typeof roundedPercentage === 'number' ? `${roundedPercentage}%` : roundedPercentage}</Text> */}
                  <MaterialIcons name="whatshot" size={55} color="#001F3F"/>
                </View>
              )}
            </AnimatedCircularProgress>
          </View>
        );
      };

    useEffect(() => {
        const fetchFoods = async () => {
            console.log('Fetching foods for email:', globalemail);
            console.log(date)
            try {
                const response = await fetch(`https://us-central1-metrix-ai-afc04.cloudfunctions.net/firestorefunc/getFoods`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ globalemail, date }),
                });

                console.log('Response status:', response.status);
                const responseText = await response.text();
                console.log('Raw response text:', responseText);

                if (response.ok) {
                    const data = JSON.parse(responseText);
                    setFoods(data);
                    console.log('Fetched foods:', data);

                    // Calculate the total macros and calories
                    let totalFat = 0;
                    let totalCarbs = 0;
                    let totalProtein = 0;
                    let totalCalories = 0;

                    data.forEach(food => {
                        totalFat += food.fat;
                        totalCarbs += food.carbs;
                        totalProtein += food.protein;
                        totalCalories += food.calories;
                    });

                    setFatConsumed(totalFat);
                    setCarbsConsumed(totalCarbs);
                    setProteinConsumed(totalProtein);
                    setCaloriesConsumed(totalCalories);

                    
                } else {
     //               console.error('Error response from server:', responseText);
                }
            } catch (error) {
                console.error('Error fetching foods:', error);
            } finally {
                setLoading(false); // Set loading to false after the request is complete
            }
        };

        fetchFoods();
    }, [globalemail, date]);

    const MacroDetailItem = ({ label, value, remaining, percentage }) => { 
        return (
        <View style={styles.macroDetailItem}>
          <Text style={styles.macroDetailText}>{label}</Text>
          <Text style={styles.macroDetailValue}>{value >= 0 ? `${value}g Left` : `${Math.abs(value)}g Over`}</Text>
          <MacroChart label={label} percentage={percentage} remainingGrams={remaining}/>
        </View>
      )};

      const renderHeader = () => {
        const remainingCalories = Math.abs(calorieGoal - caloriesConsumed);
        const remainingCaloriesNAbs = calorieGoal - caloriesConsumed
        const remainingCaloriesText = remainingCaloriesNAbs < 0 ? `${remainingCalories} Cal Over` : `${remainingCalories} Cal`;
        const remainingCaloriesWords = remainingCaloriesNAbs < 0 ? `Calories Over: ` : `Calories Remaining: `;
      return (
        <View >
          <TopBar />
          <Calendar navigation={navigation}/>
          {/* <View style={styles.header}>
            <MaterialIcons name="settings" size={24} color="#F7FAFC" style={styles.settingsIcon} />
          </View> */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
            {remainingCaloriesWords}<Text style={styles.highlight}>{remainingCaloriesText}</Text>
            </Text>
            <View style={styles.row}>
              <View style={styles.column}>
                <MacroDetailItem
                  label="Protein"
                  //value={`${dailyMacros.protein.consumed}/${dailyMacros.protein.goal}g`}
                  value={(dailyMacros.protein.goal - dailyMacros.protein.consumed)}
                  remaining={`${dailyMacros.protein.goal} - ${dailyMacros.protein.consumed}g`}
                  percentage={(dailyMacros.protein.consumed / dailyMacros.protein.goal) * 100}
                />
        
                <MacroDetailItem
                  label="Carbs"
             //     value={`${dailyMacros.carbs.consumed}/${dailyMacros.carbs.goal}g`}
                  value={(dailyMacros.carbs.goal - dailyMacros.carbs.consumed)}
                  remaining={`${dailyMacros.carbs.goal} - ${dailyMacros.carbs.consumed}g`}
                  percentage={(dailyMacros.carbs.consumed / dailyMacros.carbs.goal) * 100}
                />
    
                <MacroDetailItem
                  label="Fat"
                  // value={`${dailyMacros.fat.consumed}/${dailyMacros.fat.goal}g`}
                  value={(dailyMacros.fat.goal - dailyMacros.fat.consumed)}
                  // remaining={`${dailyMacros.fat.goal} - ${dailyMacros.fat.consumed}g`}
                  percentage={(dailyMacros.fat.consumed / dailyMacros.fat.goal) * 100}
                />
              </View>
              <CaloriesPieChart
                caloriesConsumed={caloriesConsumed}
                calorieGoal={calorieGoal}
              />
            </View>
          </View>
          {/* <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upload a Meal Photo</Text>
            <View style={styles.row}>
              <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}>Pick Image</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={takePicture}>
                <Text style={styles.buttonText}>Take Picture</Text>
              </TouchableOpacity>
            </View>
          </View> */}
          {uploading && <ActivityIndicator size="large" color="#FB8500" />}
          <Text style={styles.sectionTitle}>    Past Foods</Text>
        </View>
      )
    };

    const renderFooter = () => (
        <View style={styles.section}>
            {macroCards.length > 0 && (
                <>
                    <Text style={styles.sectionTitle}>Just Added</Text>
                    {macroCards.map((card, index) => (
                        <MacroCard
                            key={index}
                            name={card.name}
                            calories={card.calories}
                            protein={card.protein}
                            fat={card.fat}
                            carbs={card.carbs}
                            time={card.time}
                            imageUri={card.imageUri}
                            onRemove={() => removeFood(card.name)}
                        />
                    ))}
                </>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#001F3F" />
                    <Text style={styles.loadingText}>Loading foods...</Text>
                </View>
            ) : (
                <FlatList
                    data={foods}
                    keyExtractor={(item) => item.foodName}
                    renderItem={({ item }) => (
                        <MacroCard
                            name={item.foodName}
                            calories={item.calories}
                            protein={item.protein}
                            fat={item.fat}
                            carbs={item.carbs}
                            imageUri={item.imageUrl}
                            time={item.date} // Format as needed
                            onRemove={() => removeFood(item.foodName)}
                        />
                    )}
                    ListHeaderComponent={renderHeader}
                    ListFooterComponent={renderFooter}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10
      // backgroundColor: '#FFFFFF',
    },
    scrollViewContainer: {
      padding: 15,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#001F3F', // Adjust color as needed
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white', // Adjust background color as needed
    },    
    header: {
      alignItems: 'center',
      marginVertical: 8,
    },
    settingsIcon: {
      position: 'absolute',
      right: 16,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#0B0F1A',
    },
    section: {
      backgroundColor: '#F0F0F0',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#0B0F1A',
      marginBottom: 8,
    },
    highlight: {
      color: '#FB8500',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    column: {
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    calorieDetailItem: {
      alignItems: 'center',
    },
    calorieDetailText: {
      fontSize: 14,
      color: '#0B0F1A',
      marginTop: 8,
    },
    calorieDetailValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#0B0F1A',
      marginTop: 4,
    },
    innerCircle: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      width: '80%',
      height: '80%',
      borderRadius: 50,
      backgroundColor: '#fff',
    },
    macroDetailItem: {
      alignItems: 'center',
      marginBottom: 16,
    },
    macroDetailText: {
      fontSize: 14,
      color: '#0B0F1A',
      marginTop: 8,
    },
    macroDetailValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#0B0F1A',
      marginTop: 4,
    },
    macroChartContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      backgroundColor: '#fff',
      borderRadius: 50,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    macroChartText: {
      position: 'absolute',
      fontSize: 14,
      color: '#000000',
    },
    pieChartContainer: {
      marginLeft: 16,
    },
    
    transparentBackground: {
      backgroundColor: 'transparent',
    },
    button: {
      backgroundColor: '#FB8500',
      borderRadius: 8,
      padding: 10,
      margin: 5,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    image: {
      width: 200,
      height: 200,
      borderRadius: 8,
      marginVertical: 20,
    },
  });

export default PreviousDays;
