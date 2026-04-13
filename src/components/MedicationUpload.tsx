import React, { useState, useRef  } from 'react';
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
import { ActivityIndicator } from 'react-native';

//just extracting text here. no database
const medicationUpload = () =>
{
    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    
    //this is the data to be sent to database (will be able to store multiple meds for multiple uploads)
    //const [medications, setMedications] = useState<string[][]>([]);
    //const medicationMap = useRef(new Map<string, boolean>()).current; //modling after home hazards

    //OCR function - calls Google Cloud Vision API
    const sendToOCR = async (imageUri: string): Promise<string | null> => {
    try {
        // convert to base64 same as before
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

        // get identity platform token
        const { getAuth } = await import('firebase/auth');
        const auth = getAuth();
        const token = await auth.currentUser?.getIdToken();

        if (!token) {
            console.error('No auth token available');
            return null;
        }

        // call call-vision instead of Vision API directly
        const visionResponse = await fetch(
            'https://call-vision-228929058201.us-central1.run.app/ocr',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ image: base64 })
            }
        );

        if (!visionResponse.ok) {
            console.error('call-vision error:', visionResponse.status);
            return null;
        }

        const data = await visionResponse.json();
        return data.text || null;

    } catch (error) {
        console.log('OCR Error:', error);
        return null;
    }
};

    const normalizeText = (text: string): string[] => {
        return text
            .toLowerCase()
            .replace(/[^a-z\s]/g, '') //keep spaces
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

    const processImage = async (result: ImagePicker.ImagePickerResult) => 
    {
        if (!result.canceled){
            setUploading(true); // START LOADING

            const imageUri = result.assets[0].uri;
            console.log('Image URI:', imageUri);
            
            const imageText = await sendToOCR(imageUri);
            
            if(imageText){
                const medicationName = await extractMedication(imageText);
                console.log('Extracted Medication:', medicationName);

                setUploading(false); // STOP LOADING

                router.push({
                    pathname: '/medicationresults',
                    params: { medicationName: medicationName || '' }
                });
            } else {
                setUploading(false); // STOP LOADING

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
            <TouchableOpacity 
            onPress = {cameraOrGallery} 
            style={[styles.blueExtraButton, {bottom: 220}]}>
                <Text style = {[styles.btnText]}>Upload</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            onPress = {() => { router.navigate('/medicationtypedupload')}}  
            style = {[styles.greySkipButton, {bottom: 140}]}>
                <Text style = {[styles.greySkipButtonText]}>Type Medication Names</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            onPress = {() => { router.navigate('/visioninstruction')}}  
            style = {styles.greySkipButton}>
                <Text style = {[styles.greySkipButtonText]}>Skip</Text>
            </TouchableOpacity>
            {uploading && (
                <View style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 16,
                        padding: 32,
                        alignItems: 'center',
                        width: '75%',
                        marginBottom: 270
                    }}>
                        <ActivityIndicator size="large" color="#2196F3" />
                        <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 16 }}>
                            Uploading Medication
                        </Text>
                        <Text style={{ color: '#666', marginTop: 8, textAlign: 'center' }}>
                            Please keep the app open while your medication is processed.
                        </Text>
                    </View>
                </View>
            )}
        </View>
    )
}

export default medicationUpload;