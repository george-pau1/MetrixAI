import 'dotenv/config';

export default{
  "expo": {
    "name": "MetrixAI",
    "slug": "metrixaidir",
    "version": "1.0.1",
    "orientation": "portrait",
    "icon": "./assets/logoMetrixAI.jpeg",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "plugins": [ //Might be a potential problem just look and make sure
      "expo-localization"
    ],
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.HookedUp.MetrixAI",
      "buildNumber": "1.0.1",
      infoPlist: {
        NSCameraUsageDescription: "This app needs access to your camera to take and analyze the photos of the foods you provide.",
        NSPhotoLibraryUsageDescription: "This app needs access to your photo library to select and analyze the photos of foods you provide."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      eas: {
        projectId: "cd2c859c-26f4-4334-aa04-27509a0c160c"
      }
    }
    //Add the EAS Project ID HERE
  }
}
