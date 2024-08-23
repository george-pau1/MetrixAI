import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, getReactNativePersistence} from 'firebase/auth';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the type for the expected extra configuration
type FirebaseConfig = {
  firebaseApiKey: string;
  firebaseAuthDomain: string;
  firebaseProjectId: string;
  firebaseStorageBucket: string;
  firebaseMessagingSenderId: string;
  firebaseAppId: string;
  firebaseMeasurementId?: string;
};

// Assert the type of Constants.expoConfig.extra
const extra = Constants.expoConfig?.extra as FirebaseConfig;

// Extract Firebase configuration from environment variables
const {
  firebaseApiKey,
  firebaseAuthDomain,
  firebaseProjectId,
  firebaseStorageBucket,
  firebaseMessagingSenderId,
  firebaseAppId,
  firebaseMeasurementId,
} = extra;

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId,
  measurementId: firebaseMeasurementId,
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with React Native persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export {
  app,
  auth
};
