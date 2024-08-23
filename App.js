import { StyleSheet, Text, View } from 'react-native';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';

//Global Variables
import { EmailProvider } from './contexts/EmailContext';

import { DateProvider } from './contexts/DateContext';

import { CalorieProvider } from './contexts/CalorieContext';
import { ProteinProvider } from './contexts/ProteinContext';
import { FatProvider } from './contexts/FatContext';
import { CarbsProvider } from './contexts/CarbsContext';

import { AgeProvider } from './contexts/AgeContext';
import { GenderProvider } from './contexts/GenderContext';
import { GoalProvider } from './contexts/GoalSelection';
import { HeightWProvider } from './contexts/HeightWContext';
import { WorkoutProvider } from './contexts/WorkoutContext'; //CAN SIMPLIFY THESE ALL TO ONE PROVIDER
import { ImpMetricProvider } from './contexts/ImpMetricContext';

//Login Screens
import LoginScreen from "./loginscreens/Login";
import SignUpScreen from "./loginscreens/SignUp";

//Survey Screens
import GenderSelectionScreen from './surveyscreens/GenderSelection';
import WorkoutFrequencyScreen from './surveyscreens/WorkoutCount';
import MeasurementInputScreen from './surveyscreens/MeasurementInput';
import AgeSelectionScreen from './surveyscreens/AgeSelection';
import GoalSelectionScreen from './surveyscreens/GoalSelection';
import HeightSelectionScreen from './surveyscreens/HeightSelection'

//Main Screens
import ImageUploadScreen from './mainscreens/UploadImage';
import HomeScreen from './mainscreens/HomeScreen';
import DescribeMeal from './mainscreens/DescribeMeal';
import PreviousDays from './mainscreens/PreviousDays';
import SettingsScreen from './mainscreens/SettingsScreen'

//Loading Screens
import AfterSurvey from './loadingscreens/aftersurvey';
import CreateAccount from './loadingscreens/createAccount';
import LoginLoadingScreen from './loadingscreens/loginloadingscreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
  <CalorieProvider>
    <ProteinProvider>
      <CarbsProvider>
        <FatProvider>
          <AgeProvider>
            <GenderProvider>
              <GoalProvider>
                <HeightWProvider>
                  <ImpMetricProvider>
                    <WorkoutProvider>
                      <EmailProvider>
                        <DateProvider>
                            <NavigationContainer>
                              <Stack.Navigator initialRouteName="Login">
                                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                                <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />

                                <Stack.Screen name="GenderSelection" component={GenderSelectionScreen} options={{ headerShown: false }} />
                                <Stack.Screen name="WorkoutCount" component={WorkoutFrequencyScreen} options={{ headerShown: false }} />
                                <Stack.Screen name="MeasurementInput" component={MeasurementInputScreen} options={{ headerShown: false }} />
                                <Stack.Screen name="HeightSelection" component={HeightSelectionScreen} options={{ headerShown: false }} /> 

                                <Stack.Screen name="AgeSelection" component={AgeSelectionScreen} options={{ headerShown: false }} />
                                <Stack.Screen name="GoalSelection" component={GoalSelectionScreen} options={{ headerShown: false }} />

                                <Stack.Screen name="ImageUpload" component={ImageUploadScreen} options={{ headerShown: false }} />
                                <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
                                <Stack.Screen name="DescribeMeal" component={DescribeMeal} options={{ headerShown: false }} />
                                <Stack.Screen name="PreviousDays" component={PreviousDays} options={{ headerShown: false }} />
                                <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ headerShown: false }} />

                                <Stack.Screen name="AfterSurvey" component={AfterSurvey} options={{ headerShown: false }} />
                                <Stack.Screen name="CreateAccount" component={CreateAccount} options={{ headerShown: false }} />
                                <Stack.Screen name="LoginLoading" component={LoginLoadingScreen} options={{ headerShown: false }} />
                              </Stack.Navigator>
                            </NavigationContainer>
                          </DateProvider>
                      </EmailProvider>
                    </WorkoutProvider>
                  </ImpMetricProvider>
                </HeightWProvider>
              </GoalProvider>
            </GenderProvider> 
          </AgeProvider>
        </FatProvider>
      </CarbsProvider>
    </ProteinProvider>
  </CalorieProvider>
    );
  }
