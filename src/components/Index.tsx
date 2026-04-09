import { StyleSheet, Text, View, ImageBackground, Alert, TouchableOpacity, Platform} from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import {styles} from '../styles/styles';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

const Index = () => 
{
  const Shield = require('../assets/Shield.png');

  const router = useRouter()

  const { t, i18n } = useTranslation();

  return (
    <View style = {{flex: 1}}>
      <LinearGradient
        colors={['#FDB10D', '#B14B02', '#A1210F']}
        style = {{alignItems: "center", flex: 1}}
      >

      <ImageBackground source = {Shield} style = {styles.shield}>
        <Text style = {styles.tempText}>{t('index.title')}</Text>
      </ImageBackground>

      <TouchableOpacity onPress = {() => router.navigate('/login')} style = {[styles.btn, styles.inxBtn]}>
        <Text style = {styles.btnText}>{t('index.getStarted')}</Text>
      </TouchableOpacity>

      </LinearGradient>
    </View>
  )
}

export default Index