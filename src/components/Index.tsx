import { StyleSheet, Text, View, ImageBackground, Alert, TouchableOpacity, Platform} from 'react-native'
import Shield from '../assets/Shield.png'
import React from 'react'
import { addUserAuto } from '../firebase'
import { useRouter } from 'expo-router'
import {styles} from '../styles/styles'
import LinearGradient from 'react-native-linear-gradient';

const index = () => 
{
  const handleCreateUser = async () => {
    const sample = {
      name: 'Test User',
      email: 'testuser@example.com',
      createdAt: new Date().toISOString(),
    }
    const res = await addUserAuto(sample)
    if (res.success) {
      Alert.alert('User created', `id: ${res.id}`)
    } else {
      Alert.alert('Error', String(res.error))
    }
  }

    const router = useRouter()

  return (
    <View style = {styles.inxContainer}>
      <TouchableOpacity onPress = {handleCreateUser} style={[styles.inxBtn, styles.sampleUserBtn]}>
        <Text style={styles.inxBtnText}>Create Sample User</Text>
      </TouchableOpacity>

      <ImageBackground source = {Shield} style = {styles.shield}>
        <Text style = {styles.tempText}>STEADI</Text>
      </ImageBackground>

      <TouchableOpacity onPress = {() => router.navigate('/login')} style = {styles.inxBtn}>
        <Text style = {styles.inxBtnText}>Get Started</Text>
      </TouchableOpacity>

    </View>
  )
}

export default index