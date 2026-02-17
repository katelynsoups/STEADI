import React from 'react';
import { styles } from '../styles/styles';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
   StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { updateSaveStatus } from '../utils/saveUnit';

export type successState = {text : string};

const checkmark = require('../assets/success.png');

const Success: React.FC<successState> = ({text}) =>
{
    const router = useRouter()
    updateSaveStatus();

     const successStyle = StyleSheet.create(
            {
                text: {
                    fontWeight: 'bold', 
                    fontSize: 25, 
                    textAlign: 'center', 
                    lineHeight: 40
                }
            })

    return (
        <View style = {styles.background}> 
            <Text style = {[styles.inputHeader, successStyle.text]}>{text}</Text>

            <Image source = {checkmark} style = {{width: 150, height: 150}}/>

            <TouchableOpacity onPress = {() => { router.navigate('/homehazards')}} style = {styles.blueNextButton}>
                <Text style = {[styles.btnText]}>Next</Text>
            </TouchableOpacity>
        </View>
        
    )
}

export default Success;