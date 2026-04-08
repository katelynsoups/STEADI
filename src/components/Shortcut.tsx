import { StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import React from 'react'    
import { useRouter } from 'expo-router'
import {styles} from '../styles/styles'
import { useTranslation } from 'react-i18next';

const Shortcut = () => 
{
  const router = useRouter()
  const { t, i18n } = useTranslation();
  
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
      <Text style = {styles.btnText}>{t('shortcut.screening')}</Text>
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
      <Text style = {styles.btnText}>{t('shortcut.modifiableRisk')}</Text>

    </TouchableOpacity>

       <TouchableOpacity
      onPress={() => router.navigate('/pdfgen')}
      style={[
        styles.btn,
        {
          height: 56,
          justifyContent: 'center',
          marginBottom: 16,
        },
      ]}>
      <Text style = {styles.btnText}>{t('shortcut.pdfGen')}</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => router.navigate('/foottest')}
      style={[
        styles.btn,
        {
          height: 56,
          justifyContent: 'center',
          marginBottom: 16,
        },
      ]}>
      <Text style = {styles.btnText}>Go to Foot Test</Text>
    </TouchableOpacity>

      <TouchableOpacity
      onPress={() => router.navigate('/walkingupload')}
      style={[
        styles.btn,
        {
          height: 56,
          justifyContent: 'center',
        },
      ]}>
      <Text style = {styles.btnText}>Go to TUG test</Text>
    </TouchableOpacity>

    </View>
  )
}

export default Shortcut