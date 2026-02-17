import React, { useState } from 'react';
import { styles } from '../styles/styles';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Radiobtn from './RadioBtn';
import { useRouter } from 'expo-router';
import { enterVitaminD } from '../utils/dataEntry';
import { updateSaveStatus } from '../utils/saveUnit';

const VitaminDTest = () =>
{
    const[vitaminD, setVitaminD] = useState("");
    const router = useRouter();
    updateSaveStatus();
    
    const handleVitaminD = async () => {
      try{
        await enterVitaminD(vitaminD);
        router.navigate('/login');
      } catch (error: any) {
        console.error('Database entry error:', error);
      }
    };

  return (
    <View style = {styles.background}> 
      <Text style = {[styles.inputHeader, {marginBottom : 20}]}>You are almost finished with the assessment.</Text>

      <Text style = {[styles.inputHeader, {marginBottom : 20}]}>Now, check the Vitamin D test you took at the start of the assessment and select one of the following results.</Text>

      <Text style = {[styles.inputHeader, {marginBottom : 20}]}>Select one:</Text>

      <Radiobtn options = {[
        {label: "Normal (Can see line easily)", value: "Normal"},
        {label: "Low (No line or very faint line)", value: "Low"}
      ]}
       checkedValue ={vitaminD}
       onChange ={setVitaminD}
       style = {{marginBottom: 15}}
      />

      <TouchableOpacity onPress = {handleVitaminD} style = {styles.blueNextButton}>
        <Text style = {[styles.btnText]}>Next</Text>
      </TouchableOpacity>
    </View>
    
    )
}

export default VitaminDTest;