import React, { useState } from 'react';
import { styles } from '../styles/styles';
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Constants from "expo-constants";

const medicationUpload = () =>
{
    const router = useRouter();
    const [medications, setMedications] = useState<string[][]>([]);

    // OCR function - calls Google Cloud Vision API
    const sendToOCR = async (imageUri: string): Promise<string | null> => {
        try {
            // Convert image to base64
            const response = await fetch(imageUri);
            const blob = await response.blob();
            const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result && typeof reader.result === 'string') {
                        resolve(reader.result.split(',')[1]);
                    } else {
                        reject(new Error('Failed to read file'));
                    }
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });

            const extra = Constants.expoConfig?.extra ?? Constants.extra;

            // Call Google Cloud Vision API
            const apiKey = extra?.visionApiKey;
            const visionResponse = await fetch(
                `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        requests: [
                            {
                                image: { content: base64 },
                                features: [{ type: 'TEXT_DETECTION' }]
                            }
                        ]
                    })
                }
            );

            const data = await visionResponse.json();
            const extractedText = data.responses[0]?.textAnnotations[0]?.description || 'No text found';
            return extractedText;

        } catch (error) {
            console.error('OCR Error:', error);
            Alert.alert('Error', 'Failed to extract text from image');
            return null;
        }
    };

    const pickImage = async () => 
    {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if(!permissionResult.granted)
        {
            Alert.alert('Permission required', 'Permission to access the media library is required.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync(
            {
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 1,
            }
        );

        if (!result.canceled)
        {
            const imageUri = result.assets[0].uri;
            
            // Send to OCR
            const medicationText = await sendToOCR(imageUri);
            
            if (medicationText) {
                // Add to medications array
                setMedications(prev => [...prev, [medicationText, "yes"]]);
                
                // Navigate to results, passing the extracted text
                router.push({
                    pathname: '/medicationresults',
                    params: { medicationText }
                });
            }
        }
    }
    
    const takePicture = async () => 
    {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if(!permissionResult.granted)
        {
            Alert.alert('Permission required', 'Permission to access your camera is required.');
            return;
        }

        let result = await ImagePicker.launchCameraAsync(
            {
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 1,
            }
        );

        if (!result.canceled)
        {
            const imageUri = result.assets[0].uri;
            
            // Send to OCR
            const medicationText = await sendToOCR(imageUri);
            
            if (medicationText) {
                // Add to medications array
                setMedications(prev => [...prev, [medicationText, "yes"]]);
                
                // Navigate to results, passing the extracted text
                router.push({
                    pathname: '/medicationresults',
                    params: { medicationText }
                });
            }
        }
    }

    const cameraOrGallery = () =>
    {
        Alert.alert(
            "Select Image Source",
            "How would you like to upload your medication?",
            [
                {
                    text: "Gallery",
                    onPress: () => pickImage(),
                },
                {
                    text: "Camera",
                    onPress: () => takePicture(),
                },
                {
                    text: "Cancel",
                    style: "cancel"
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style = {styles.background}> 
            <Text style = {styles.inputHeader}>This is where you will upload a picture of your medication</Text>
            <Text style = {styles.inputHeader}>Select "Upload" to select photo from camera roll or take photo.</Text>
            <TouchableOpacity onPress = {cameraOrGallery} style = {styles.blueNextButton}>
                <Text style = {[styles.btnText]}>Upload</Text>
            </TouchableOpacity>
        </View>
    )
}

export default medicationUpload;