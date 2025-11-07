import { StyleSheet, Text, View, ImageBackground, Alert, TouchableOpacity, Platform} from 'react-native'
import Shield from '../assets/Shield.png'
import React from 'react'
import { addUserAuto } from '../firebase'
import { useRouter } from 'expo-router'
import {styles} from '../styles/styles'
import { LinearGradient } from 'expo-linear-gradient'

const Index = () => 
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

  //Remove shortcut button when app is ready -Jean
  return (
    <View style = {{flex: 1}}>
      <LinearGradient
        colors={['#FDB10D', '#B14B02', '#A1210F']}
        style = {{alignItems: "center", flex: 1}}
      >
      <TouchableOpacity onPress = {handleCreateUser} style={[styles.btn, styles.inxBtn, styles.sampleUserBtn]}>
        <Text style={styles.btnText}>Create Sample User</Text>
      </TouchableOpacity>

      <ImageBackground source = {Shield} style = {styles.shield}>
        <Text style = {styles.tempText}>STEADI</Text>
      </ImageBackground>

      <TouchableOpacity onPress = {() => router.navigate('/login')} style = {[styles.btn, styles.inxBtn]}>
        <Text style = {styles.btnText}>Get Started</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress = {() => router.navigate('/shortcut')} style = {[styles.btn, styles.shortBtn]}>
        <Text style = {styles.btnText}>Page Shortcut</Text>
      </TouchableOpacity>

      </LinearGradient>
    </View>
  )
}

export default Index