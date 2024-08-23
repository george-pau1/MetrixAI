import React, { useEffect, useContext, useState, useMemo } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image, SafeAreaView, FlatList, TextInput , Button} from 'react-native';
import { Avatar } from 'react-native-paper';
import Svg, { Circle, G,Text as SvgText } from 'react-native-svg';
import PieChart from 'react-native-expo-pie-chart';
import { MaterialIcons } from '@expo/vector-icons';
import TopBar from '../components/TopBar';
import Calendar from '../components/Calendar';
import Footer from '../components/Footer';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import MacroCard from '../components/MacroCard';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import axios from 'axios'
import { format } from 'date-fns';
import { Icon } from 'react-native-elements';

import { CalorieContext } from '../contexts/CalorieContext';
import { FatContext } from '../contexts/FatContext';
import { ProteinContext } from '../contexts/ProteinContext';
import { CarbsContext } from '../contexts/CarbsContext';
import { EmailContext } from '../contexts/EmailContext';

import { pickImage, takePicture, uploadImage } from '../functions/FuncHomescreen';

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

const EditFoodForm = ({ food, onSave, onCancel }) => {
  const [foodName, setFoodName] = useState(food.foodName);
  const [calories, setCalories] = useState(food.calories);
  const [protein, setProtein] = useState(food.protein);
  const [carbs, setCarbs] = useState(food.carbs);
  const [fat, setFat] = useState(food.fat);

  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState(null);

  const handleSave = () => {
    setIsEditing(false);
    setEditingField(null);
    onSave({ foodName, calories, protein, carbs, fat });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingField(null);
    onCancel();
  };

  return (
    <View style={styles.editcard}>
      {editingField === 'foodName' ? (
        <TextInput
          style={styles.editmealName}
          value={foodName}
          onChangeText={setFoodName}
          onBlur={() => setEditingField(null)}
          autoFocus
        />
      ) : (
        <TouchableOpacity onPress={() => setEditingField('foodName')}>
          <Text style={styles.editmealName}>{foodName}</Text>
        </TouchableOpacity>
      )}
      <View style={styles.editnutrientContainer}>
        <View style={styles.editnutrient}>
          <Icon name="fire" type="font-awesome" color="#000" />
          <Text style={styles.editnutrientText}>Calories</Text>
          {editingField === 'calories' ? (
            <TextInput
              style={styles.editnutrientValue}
              value={String(calories)}
              onChangeText={setCalories}
              keyboardType="numeric"
              autoFocus
              onBlur={() => setEditingField(null)}
            />
          ) : (
            <TouchableOpacity onPress={() => setEditingField('calories')}>
              <Text style={styles.editnutrientValue}>{calories}</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.editnutrient}>
          <Icon name="leaf" type="font-awesome" color="#000" />
          <Text style={styles.editnutrientText}>Carbs</Text>
          {editingField === 'carbs' ? (
            <TextInput
              style={styles.editnutrientValue}
              value={String(carbs)}
              onChangeText={setCarbs}
              keyboardType="numeric"
              autoFocus
              onBlur={() => setEditingField(null)}
            />
          ) : (
            <TouchableOpacity onPress={() => setEditingField('carbs')}>
              <Text style={styles.editnutrientValue}>{carbs}g</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.editnutrient}>
          <Icon name="drumstick-bite" type="font-awesome-5" color="#000" />
          <Text style={styles.editnutrientText}>Protein</Text>
          {editingField === 'protein' ? (
            <TextInput
              style={styles.editnutrientValue}
              value={String(protein)}
              onChangeText={setProtein}
              keyboardType="numeric"
              autoFocus
              onBlur={() => setEditingField(null)}
            />
          ) : (
            <TouchableOpacity onPress={() => setEditingField('protein')}>
              <Text style={styles.editnutrientValue}>{protein}g</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.editnutrient}>
          <Icon name="tint" type="font-awesome" color="#000" />
          <Text style={styles.editnutrientText}>Fats</Text>
          {editingField === 'fat' ? (
            <TextInput
              style={styles.editnutrientValue}
              value={String(fat)}
              onChangeText={setFat}
              keyboardType="numeric"
              autoFocus
              onBlur={() => setEditingField(null)}
            />
          ) : (
            <TouchableOpacity onPress={() => setEditingField('fat')}>
              <Text style={styles.editnutrientValue}>{fat}g</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.editdoneButton} onPress={handleSave}>
        <Text style={styles.editdoneButtonText}>DONE</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.editcancelButton} onPress={handleCancel}>
        <Text style={styles.editcancelButtonText}>CANCEL</Text>
      </TouchableOpacity>
    </View>
  );
};

const HomeScreen = ({navigation}) => {
  const { calories: calorieGoal, setCalories } = useContext(CalorieContext);
  const { fat: fatGoal, setFat } = useContext(FatContext);
  const { carbs: carbsGoal, setCarbs } = useContext(CarbsContext);
  const { protein: proteinGoal, setProtein } = useContext(ProteinContext);
  const {globalemail, setEmail} = useContext(EmailContext);

  const [foods, setFoods] = useState([]);

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

  const [isEditing, setIsEditing] = useState(false);
  const [currentFood, setCurrentFood] = useState(null);

  const [triggerRender, setTriggerRender] = useState(false);


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

  const saveEditedFood = async (editedFood) => {
    try {
      const now = new Date();
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const formattedDate = format(now, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone });


      //NEED TO MAKE A NEW FUNCTION THAT STATES THE NEWFOODNAME AND ALSO PROVIDES THE OLD FOOD NAME
      if (currentFood.foodName ==editedFood.foodName)
      {
        console.log(editedFood.foodName)
        console.log(editedFood.calories)
        console.log(editedFood.protein)
        console.log(editedFood.carbs)
        console.log(editedFood.fat)
        console.log(currentFood.imageUrl)
        console.log(formattedDate)

        const response = await fetch('https://us-central1-metrix-ai-afc04.cloudfunctions.net/firestorefunc/editFood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          globalemail,
          foodName: editedFood.foodName,
          calories: editedFood.calories,
          protein: editedFood.protein,
          carbs: editedFood.carbs,
          fat: editedFood.fat,
          imageUrl: currentFood.imageUrl, // Keep the original image URL
          date: formattedDate,
        }),
      });
        if (response.ok) {
          setFoods(prevFoods =>
            prevFoods.map(food =>
              food.foodName === currentFood.foodName ? { ...food, ...editedFood } : food
            )
          );
          setIsEditing(false);
          setCurrentFood(null);
        } else {
          console.error('Error response from server:', await response.text());
        }
      } else { //IF THE USER CREATED A NEW NAME FOR THE FOOD
        const response = await fetch('https://us-central1-metrix-ai-afc04.cloudfunctions.net/firestorefunc/editFood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          globalemail,
          foodName: currentFood.foodName,
          newFoodName: editedFood.foodName,
          calories: editedFood.calories,
          protein: editedFood.protein,
          carbs: editedFood.carbs,
          fat: editedFood.fat,
          imageUrl: currentFood.imageUrl, // Keep the original image URL
          date: formattedDate,
        }),
        });
          if (response.ok) {
            setFoods(prevFoods =>
              prevFoods.map(food =>
                food.foodName === currentFood.foodName ? { ...food, ...editedFood } : food
              )
            );
            setIsEditing(false);
            setCurrentFood(null);
          } else {
            console.error('Error response from server:', await response.text());
          }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    (async () => {
      const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus === 'granted');

      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus === 'granted');
    })();
  }, []);

  //Update the calculation of the food from the macroCards and the ones that were added before
  useEffect(() => {
    // Recalculate total macros and calories whenever foods or macroCards change
    let totalFat = 0;
    let totalCarbs = 0;
    let totalProtein = 0;
    let totalCalories = 0;
  
    [...foods, ...macroCards].forEach(item => {
      totalFat += Math.round(parseFloat(item.fat));
      totalCarbs += Math.round(parseFloat(item.carbs));
      totalProtein += Math.round(parseFloat(item.protein));
      totalCalories += Math.round(parseFloat(item.calories));
    });
  
    setFatConsumed(totalFat);
    setCarbsConsumed(totalCarbs);
    setProteinConsumed(totalProtein);
    setCaloriesConsumed(totalCalories);
  }, [foods, macroCards]);

  useEffect(() => {
    const fetchFoods = async (globalemail) => {
      console.log('Fetching foods for email:', globalemail);
      try {
        const response = await fetch(`https://us-central1-metrix-ai-afc04.cloudfunctions.net/firestorefunc/getFoods`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ globalemail }),
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
            totalFat += Math.round(food.fat);
            totalCarbs += Math.round(food.carbs);
            totalProtein += Math.round(food.protein);
            totalCalories += Math.round(food.calories);
          });
  
          setFatConsumed(totalFat);
          setCarbsConsumed(totalCarbs);
          setProteinConsumed(totalProtein);
          setCaloriesConsumed(totalCalories);
        } else {
   //       console.error('Error response from server:', responseText);
        }
      } catch (error) {
        console.error('Error fetching foods:', error);
      }
    };
  
    fetchFoods(globalemail);
  }, [globalemail]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick an image. Please try again.');
    }
  };

  const takePicture = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take a picture. Please try again.');
    }
  };

  const uploadImage = async (fileUri) => {
    setUploading(true);
    const data = new FormData();

    data.append('file', {
      uri: fileUri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });
    data.append('upload_preset', 'images');
    data.append('cloud_name', 'dq9vilkvp');

    try {
      const response = await fetch('https://us-central1-metrix-ai-afc04.cloudfunctions.net/firestorefunc/amountOfPictures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ globalemail }),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.userDocCameraUses < 1) {
          Alert.alert("No more pictures left", "Come back again tomorrow!");
          setUploading(false);
          return;
        }
        
        console.log('Sufficient Pictures Left', responseData);

        try {
          const uploadResponse = await fetch('https://api.cloudinary.com/v1_1/dq9vilkvp/image/upload', {
            method: 'POST',
            body: data,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          const uploadData = await uploadResponse.json();
          if (uploadResponse.ok) {
            const imageUrl = uploadData.secure_url;
            console.log(imageUrl);
            Alert.alert('Success', 'Image uploaded successfully!');
            await sendImageUrlToEndpoint(imageUrl, fileUri);
          } else {
            console.log('Upload error:', uploadData);
            Alert.alert('Error', 'Failed to upload image. Please try again.');
          }
        } catch (error) {
          console.log('Upload error:', error);
          Alert.alert('Error', 'Failed to upload image. Please try again.');
        } finally {
          setUploading(false);
        }

      } else {
        const responseData = await response.text();
        console.error('Error:', responseData);
        Alert.alert('Error', responseData.includes("pictureUses is already 0") ? "No more pictures left" : "Failed to add food", "Come back again tomorrow!");
        setUploading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Failed to check daily picture uses', 'Please try again');
      setUploading(false);
      throw error;
    }
  };
  

  const addFoodToDatabase = async (userId, foodName, calories, protein, carbs, fat, imageUrl) => {
    console.log(macroCards) // Make sure to delete this after
    const currentDate = new Date().toLocaleString(); // Get the current date in a readable format
    
    try {
      const response = await fetch('https://us-central1-metrix-ai-afc04.cloudfunctions.net/firestorefunc/addFood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, foodName, calories, protein, carbs, fat, imageUrl, date: currentDate }),
      });
  
      if (response.ok) {
        const responseData = await response.text();
        console.log('Food added successfully:', responseData);
        return responseData;
      } else {
        const responseData = await response.text();
    //    console.error('Error adding food:', responseData);
        if (responseData.includes("pictureUses is already 0")) {
          Alert.alert(
            "No more pictures left",
            "Come back again tomorrow!"
          );
        }
 //       throw new Error('Failed to add food');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const removeFood = async (foodName) => {
    // console.log(foodName)
    // console.log(globalemail)
    try {
      const response = await fetch('https://us-central1-metrix-ai-afc04.cloudfunctions.net/firestorefunc/removeFood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ globalemail, foodName }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Food removed successfully!');
        const foodToRemove = foods.find((food) => food.foodName === foodName);
        if (foodToRemove) {
          // Update the context values before removing the food item
          setCaloriesConsumed(prevCalories => prevCalories - foodToRemove.calories);
          setFatConsumed(prevFat => prevFat - foodToRemove.fat);
          setCarbsConsumed(prevCarbs => prevCarbs - foodToRemove.carbs);
          setProteinConsumed(prevProtein => prevProtein - foodToRemove.protein);
        }
        await setFoods(foods.filter((food) => food.foodName !== foodName)); //Might need to change back to this
        await setMacroCards(macroCards.filter((foodToRemove) => foodToRemove.name !== foodName))

        await setTriggerRender(prev => !prev);
        
        
      } else {
        const responseData = await response.text();
        console.error('Error removing food:', responseData);
        Alert.alert('Error', 'Failed to remove food. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to remove food. Please try again.');
    }
  };
  
  const sendImageUrlToEndpoint = async (imageUrl, imageUri, userId) => {
    setLoadingResponse(true);
  
    try {
      const response = await fetch('https://us-central1-metrix-ai-afc04.cloudfunctions.net/gptfunc/postMacros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_url: imageUrl }),
      });
  
      const responseText = await response.text();
      console.log('Raw response text:', responseText);
  
      try {
        const responseData = JSON.parse(responseText);
        console.log('Parsed response data:', responseData);
  
        if (response.ok) {
          const content = responseData.message.content;
          const outputCalindex = content.lastIndexOf("Calories");
  
          if (outputCalindex !== -1) {
            const output1 = content.substring(outputCalindex);
            await setTotalMacros(output1);
  
            const numbers = output1.match(/\d+(\.\d+)?/g);
          const numericValues = numbers.map(num => Math.round(parseFloat(num)));

          // Find the amount of protein
          const outputProteinindex = output1.lastIndexOf("Protein");
          const output2 = output1.substring(outputProteinindex);

          const numbers2 = output2.match(/\d+(\.\d+)?/g);
          const numericValues2 = numbers2.map(num => Math.round(parseFloat(num)));

          // Find the amount of fat
          const outputFatindex = output1.lastIndexOf("Fat");
          const output3 = output1.substring(outputFatindex);

          const numbers3 = output3.match(/\d+(\.\d+)?/g);
          const numericValues3 = numbers3.map(num => Math.round(parseFloat(num)));

          // Find the amount of carbs
          const outputCarbsindex = output1.lastIndexOf("Carb");
          const output4 = output1.substring(outputCarbsindex);

          const numbers4 = output4.match(/\d+(\.\d+)?/g);
          const numericValues4 = numbers4.map(num => Math.round(parseFloat(num)));

            let foodName = 'Uploaded Food' //Default name
            //Find the name of the food
            try {
              const foodNameResponse = await axios.post('https://us-central1-flirtx-5696f.cloudfunctions.net/gptfunc/give-rizz', {
                model: 'gpt-4o',
                message: `Find the name of the dish and return it in 4 words or less. By all means don't return any other text. This is the food: ${content}`,
              });
            

              // Check if response.data is a string
              let foodNameResponseData = foodNameResponse.data;
              
              if (typeof foodNameResponseData === 'object') {
                // Convert object to string for regex processing
                foodNameResponseData = JSON.stringify(foodNameResponseData);
              }

              //Find the first 4 words, if they are not capital (part of the name), they are taken out
              const words = foodNameResponseData.match(/\b(\w+)\b/g);
              const slicedWords = words ? words.slice(3, 7) : [];
              const capitalizedWords = slicedWords.filter(word => /^[A-Z]/.test(word));
              foodName = capitalizedWords.join(' ');
              
              console.log(`foodName: ${foodName}`);
            } catch (error) {
              console.error('Error finding the name of the food:', error);
            }
  
            if (numericValues.length >= 4) {
              const [calories] = numericValues;
              const [protein] = numericValues2;
              const [fat] = numericValues3;
              const [carbs] = numericValues4;
  
              setFatConsumed(prev => prev + fat);
              setCarbsConsumed(prev => prev + carbs);
              setProteinConsumed(prev => prev + protein);
              setCaloriesConsumed(prev => prev + calories);
  
              setMacroCards(prevCards => [
                ...prevCards,
                {
                  imageUri,
                  name: foodName, // Can change this to the actual name if available from API response
                  calories,
                  protein,
                  fat,
                  carbs,
                  time: new Date().toLocaleTimeString(),
                },
              ]);
  
              // Call the addFoodToDatabase function
              await addFoodToDatabase(globalemail, foodName, calories, protein, carbs, fat, imageUrl); //Make sure to change these
            } else {
              console.log('Unable to extract values from response');
            }
          } else {
            console.log('Unable to find "Calories" in response content');
          }
        } else {
          console.log('Error:', responseData);
          Alert.alert('Error', 'Failed to process image. Please try again.');
        }
      } catch (parseError) {
        console.log('Parse error:', parseError);
        console.log('Response text:', responseText); // Print the raw response text for debugging
        Alert.alert('Error', 'Failed to process image. Please try again.');
      }
    } catch (error) {
      console.log('Error:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    } finally {
      setLoadingResponse(false);
    }
  };

  const renderHeader = () => {
    const remainingCalories = Math.abs(calorieGoal - caloriesConsumed);
    const remainingCaloriesNAbs = calorieGoal - caloriesConsumed
    const remainingCaloriesText = remainingCaloriesNAbs < 0 ? `${remainingCalories} Cal Over` : `${remainingCalories} Cal`;
    const remainingCaloriesWords = remainingCaloriesNAbs < 0 ? `Calories Over: ` : `Calories Remaining: `;
  return (
    <View >
      <TopBar navigation = {navigation} />
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
          <View key ={triggerRender.toString()}></View>
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
      {/* <Footer navigation={navigation} onScanFoodPress={takePicture} onSavedFoodsPress={pickImage} /> */}
    </View>
  );



  return (
    <SafeAreaView style={styles.container}>
  {isEditing && currentFood ? (
    <EditFoodForm
      food={currentFood}
      onSave={saveEditedFood}
      onCancel={() => setIsEditing(false)}
    />
  ) : (
    <FlatList
      data={foods}
      keyExtractor={(item) => item.foodName}
      renderItem={({ item }) => (
        <View style={styles.foodItemContainer}>
          <MacroCard
            name={item.foodName}
            calories={item.calories}
            protein={item.protein}
            fat={item.fat}
            carbs={item.carbs}
            imageUri={item.imageUrl}
            time={item.date} // Format as needed
            onRemove={() => removeFood(item.foodName)}
            onEdit={() => {
              setCurrentFood(item);
              setIsEditing(true);
            }}
          />
        </View>
      )}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
    />
  )}
  {!isEditing && (
    <Footer navigation={navigation} onScanFoodPress={takePicture} onSavedFoodsPress={pickImage} />
  )}
</SafeAreaView>
  
  );
};

const MacroDetailItem = ({ label, value, remaining, percentage }) => { 
  return (
  <View style={styles.macroDetailItem}>
    <Text style={styles.macroDetailText}>{label}</Text>
    <Text style={styles.macroDetailValue}>{value >= 0 ? `${value}g Left` : `${Math.abs(value)}g Over`}</Text>
    <MacroChart label={label} percentage={percentage} remainingGrams={remaining}/>
  </View>
)};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingHorizontal: 16
    // backgroundColor: '#FFFFFF',
  },
  scrollViewContainer: {
    padding: 15,
  },
  header: {
    alignItems: 'center',
    marginVertical: 8,
  },
  settingsIcon: {

  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0B0F1A',
  },
  percentageText: {
    fontSize: 28,
    fontWeight: 'bold',
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
  foodItemContainer: { //For the flatlist from past food
    paddingVertical: 0,
    paddingHorizontal: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    // marginTop: 50,
    marginLeft: 16,
    alignItems:'center'
  },
  pieChartLabel: {
  },
  
  transparentBackground: {
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: '#001F3F',
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

  //Edit form
  editcard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  editmealName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  editnutrientContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  editnutrient: {
    width: '45%',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  editnutrientText: {
    fontSize: 16,
    marginTop: 10,
  },
  editnutrientValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  editdoneButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  editdoneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editcancelButton: {
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  editcancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
