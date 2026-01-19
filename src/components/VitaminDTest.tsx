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

const VitaminDTest = () =>
{
    const[vitaminD, setVitaminD] = useState("");

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

      <TouchableOpacity style = {styles.blueNextButton}>
        <Text style = {[styles.btnText]}>Next</Text>
      </TouchableOpacity>
    </View>
    
    )
}

export default VitaminDTest;