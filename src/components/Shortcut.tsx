import { StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import React from 'react'    
import { useRouter } from 'expo-router'
import {styles} from '../styles/styles'

const Shortcut = () => 
{

  const router = useRouter()

  return (
    <View style={{ flex: 1, alignItems: 'center', paddingTop: 40 }}>
    <TouchableOpacity
      onPress={() => router.navigate('/screening')}
      style={[
        styles.btn,
        {
          height: 56,
          marginBottom: 16,
        },
      ]}>
      <Text style = {styles.btnText}>Begin Screening</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => router.navigate('/vitamindtestinstruct')}
      style={[
        styles.btn,
        {
          height: 56,
          justifyContent: 'center',
          marginBottom: 16,
        },
      ]}>
      <Text style = {styles.btnText}>Begin Modifiable Risk Assesment</Text>
    </TouchableOpacity>

       <TouchableOpacity
      onPress={() => router.navigate('/medicationupload')}
      style={[
        styles.btn,
        {
          height: 56,
          justifyContent: 'center',
        },
      ]}>
      <Text style = {styles.btnText}>Jump to medication upload</Text>
    </TouchableOpacity>

    </View>
  )
}

export default Shortcut