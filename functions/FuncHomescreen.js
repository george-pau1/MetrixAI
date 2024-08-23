// functions.js

import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { Alert } from 'react-native';

// Function to pick an image from the gallery
export const pickImage = async (setImage, uploadImage) => {
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

// Function to take a picture with the camera
export const takePicture = async (setImage, uploadImage) => {
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

// Function to upload an image to Cloudinary
export const uploadImage = async (fileUri, setUploading, sendImageUrlToEndpoint) => {
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
    const response = await fetch('https://api.cloudinary.com/v1_1/dq9vilkvp/image/upload', {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const responseData = await response.json();
    if (response.ok) {
      const imageUrl = responseData.secure_url;
      console.log(imageUrl);
      Alert.alert('Success', 'Image uploaded successfully!');
      await sendImageUrlToEndpoint(imageUrl, fileUri);
    } else {
      console.log('Upload error:', responseData);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    }
  } catch (error) {
    console.log('Upload error:', error);
    Alert.alert('Error', 'Failed to upload image. Please try again.');
  } finally {
    setUploading(false);
  }
};
