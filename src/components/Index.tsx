import { StyleSheet, Text, View, ImageBackground, Alert, TouchableOpacity, Platform} from 'react-native'
import Shield from '../assets/Shield.png'
import React from 'react'
import { useRouter } from 'expo-router'
import {styles} from '../styles/styles'
import { LinearGradient } from 'expo-linear-gradient'

const Index = () => 
{

  const router = useRouter()

  return (
    <View style = {{flex: 1}}>
      <LinearGradient
        colors={['#FDB10D', '#B14B02', '#A1210F']}
        style = {{alignItems: "center", flex: 1}}
      >

      <ImageBackground source = {Shield} style = {styles.shield}>
        <Text style = {styles.tempText}>STEADI</Text>
      </ImageBackground>

      <TouchableOpacity onPress = {() => router.navigate('/login')} style = {[styles.btn, styles.inxBtn]}>
        <Text style = {styles.btnText}>Get Started</Text>
      </TouchableOpacity>
      </LinearGradient>
    </View>
  )
}

export default Index