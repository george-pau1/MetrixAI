import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    Alert,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    ImageBackground,
    Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { Camera } from 'expo-camera';

const ImageUploadScreen = ({ navigation }) => {
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loadingResponse, setLoadingResponse] = useState(false);
    const [totalMacros, setTotalMacros] = useState('');

    useEffect(() => {
        (async () => {
            const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus === 'granted');

            const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus === 'granted');
        })();
    }, []);

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
                await sendImageUrlToEndpoint(imageUrl);
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

    const sendImageUrlToEndpoint = async (imageUrl) => {
        setLoadingResponse(true);
      
        try {
          const response = await fetch('https://us-central1-metrix-ai-afc04.cloudfunctions.net/gptfunc/postMacros', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image_url: imageUrl }),
          });
      
          const responseText = await response.text(); // Get raw response text
          console.log('Raw response text:', responseText); // Log the raw response text
      
          try {
            const responseData = JSON.parse(responseText); // Try to parse the response as JSON
            console.log('Parsed response data:', responseData);
      
            if (response.ok) {
              const content = responseData.message.content;
              const output1index = content.lastIndexOf("**Calories:");
              console.log("CHECK IF THIS PRINTS",output1index)
      
              if (output1index !== -1) {
                const output1 = content.substring(output1index);
                await setTotalMacros(output1);
                console.log('Total macros:', output1);
              } else {
                console.log('Calories section not found in the response content.');
                Alert.alert('Error', 'Failed to find macros in the response. Please try again.');
              }
            } else {
              console.log('Error in response:', responseData);
              Alert.alert('Error', 'Failed to get macros. Please try again.');
            }
          } catch (jsonParseError) {
            console.error('JSON Parse Error:', jsonParseError);
            console.error('Raw response text:', responseText);
            Alert.alert('Error', 'Failed to parse server response. Please try again.');
          }
        } catch (error) {
          console.log('Error in sending image URL:', error);
          Alert.alert('Error', 'Failed to get macros. Please try again.');
        } finally {
          setLoadingResponse(false);
        }
      };
      
      if (hasGalleryPermission === false || hasCameraPermission === false) {
        return <Text>No access to internal storage or camera</Text>;
      }
      
      

    const handleBackButtonPress = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'ChoiceScreen' }],
            })
        );
    };

    return (
        <ImageBackground 
            source={require('../assets/icon.png')}
            style={styles.background}
        >
            <View style={styles.overlay} />
            <TouchableOpacity style={styles.backButton} onPress={handleBackButtonPress}>
                <Ionicons name="arrow-back" size={24} color="white" />
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <Ionicons name="image-outline" size={24} color="white" />
                    <Text style={styles.buttonText}>Pick Image</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={takePicture}>
                    <Ionicons name="camera-outline" size={24} color="white" />
                    <Text style={styles.buttonText}>Take Picture</Text>
                </TouchableOpacity>
                {image && <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />}
                {uploading && <Text style={styles.uploadingText}>Uploading...</Text>}
                {loadingResponse && <ActivityIndicator size="large" color="#ff6f61" />}
                <View style={styles.textContainer}>
                    <Text style={styles.detectedText}>{totalMacros}</Text>
                </View>
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Adjust opacity as needed
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff6f61',
        padding: 10,
        borderRadius: 20,
        zIndex: 1, // Ensure backButton is on top
    },
    backButtonText: {
        color: 'white',
        marginLeft: 5,
        fontSize: 16,
        fontWeight: 'bold',
    },
    image: {
        width: 300,
        height: 300,
        marginTop: 20,
        borderColor: '#ff6f61',
    },
    textContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
        width: '100%',
    },
    detectedText: {
        fontSize: 18,
        color: '#fff',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff6f61',
        padding: 12,
        borderRadius: 30,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    uploadingText: {
        color: '#ff6f61',
        fontSize: 16,
        marginVertical: 10,
    },
});

export default ImageUploadScreen;
