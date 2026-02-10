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
import medicationList from '../utils/medications.json'; //from RXNorm used to extract drug names

const medicationUpload = () =>
{
    const router = useRouter();
    //this is the data to be sent to database (will be able to store multiple meds for multiple uploads)
    const [medications, setMedications] = useState<string[][]>([]);

    //OCR function - calls Google Cloud Vision API
    const sendToOCR = async (imageUri: string): Promise<string | null> => {
        try {
            //OCR reqs image to be base64
            const response = await fetch(imageUri);
            const blob = await response.blob();
            const base64 = await new Promise<string>((resolve, reject) => {
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

            //call api
            const apiKey = extra?.visionApiKey;

            if (!apiKey) {
                console.error('Vision API key not found');
                return null;
            }

            const visionResponse = await fetch(
                `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
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

            if (!visionResponse.ok) {
                console.error('Vision API error:', visionResponse.status);
                return null;
            }

            const data = await visionResponse.json();
            const extractedText = data.responses[0]?.textAnnotations[0]?.description || null;
            return extractedText;

        //instead of sending an error for images without text we will just log it and display a message on the next screen to the user
        } catch (error) {
            console.log('OCR Error:', error);
            //Alert.alert('Error', 'Failed to extract text from image');
            return null;
        }
    };

    const normalizeText = (text: string): string[] => {
        return text
            .toLowerCase()
            .replace(/[^a-z\s]/g, '') // keep spaces
            .split(/\s+/)
            .filter(Boolean);
    };

    const medicationSet = new Set(medicationList);

    //take the raw text from OCR and return just the medication name
    //using sliding window to address multi-word medication names
    const extractMedication = (text: string): string | null => {
        const words = normalizeText(text);

        // check longer phrases first (3 → 1)
        const MAX_PHRASE_LENGTH = 3;

        for (let length = MAX_PHRASE_LENGTH; length >= 1; length--) {
            for (let i = 0; i <= words.length - length; i++) {
            const phrase = words.slice(i, i + length).join(' ');

            if (medicationSet.has(phrase)) {
                return phrase;
            }
            }
        }

        return null;
    };


    const pickImage = async () => 
    {
        console.log('=== SELECT PICTURE STARTED ==='); 

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

        processImage(result);
    }
    
    const takePicture = async () => 
    {
        console.log('=== TAKE PICTURE STARTED ==='); 

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

        processImage(result);
    }

    const processImage = async (result: ImagePicker.ImagePickerResult) => {
        if (!result.canceled){
            const imageUri = result.assets[0].uri;
            console.log('Image URI:', imageUri);
            
            //send to OCR
            const imageText = await sendToOCR(imageUri);
            
            if(imageText){
                const medicationName = await extractMedication(imageText);
                console.log('Extracted Medication:', medicationName);
                
                if (medicationName) {
                    //add to medications array
                    setMedications(prev => [...prev, [medicationName, "yes"]]);
                }
                
                //pass empty string if no medication found in text
                router.push({
                    pathname: '/medicationresults',
                    params: { medicationName: medicationName || '' }
                });
            } else {
                //OCR failed, still pass empty string
                router.push({
                    pathname: '/medicationresults',
                    params: { medicationName: '' }
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
            <Text style = {[styles.inputHeader, {marginBottom: 16}]}>
                This is where you will upload a picture of your medication. Be sure that your image clearly shows the medication label. Only the medication name will be saved for the purpose of this analysis.
            </Text>
            <Text style = {[styles.inputHeader, {marginBottom: 16}]}>
                Please only include one medication label in your image. You will have the oportunity to repeat this step until you have uploaded all current medications.
            </Text>
            <Text style = {styles.inputHeader}>Click "Upload" to either select photo from camera roll or take photo.</Text>
            <TouchableOpacity onPress = {cameraOrGallery} style = {styles.blueExtraButton}>
                <Text style = {[styles.btnText]}>Upload</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            onPress = {() => { router.navigate('/visionupload')}}  
            style = {styles.greySkipButton}>
                <Text style = {[styles.greySkipButtonText]}>Skip</Text>
            </TouchableOpacity>
        </View>
    )
}

export default medicationUpload;