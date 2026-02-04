import React from 'react';
import { styles } from '../styles/styles';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const checkmark = require('../assets/success.png');

const MedicationResults = () =>
{
    const router = useRouter();
    const { medicationText } = useLocalSearchParams();

    const successStyle = StyleSheet.create(
        {
            text: {
                fontWeight: 'bold', 
                fontSize: 25, 
                textAlign: 'center', 
                lineHeight: 40
            }
        });

    return (
        <View style = {styles.background}> 
            <Text style = {[styles.inputHeader, successStyle.text]}>
                Medication detected: {medicationText}
            </Text>

            <Image source = {checkmark} style = {{width: 150, height: 150}}/>

            <TouchableOpacity onPress = {() => { router.navigate('/visionupload')}} style = {styles.blueNextButton}>
                <Text style = {[styles.btnText]}>Next</Text>
            </TouchableOpacity>
        </View>
    )
}

export default MedicationResults;