import { StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import React from 'react'    
import { useRouter } from 'expo-router'
import {styles} from '../styles/styles'

const Shortcut = () => 
{

    const router = useRouter()

  return (
    <View style = {{flex: 1}}>
        <TouchableOpacity onPress = {() => router.navigate('/bloodtest')}style={[styles.btn, styles.inxBtn]}>
            <Text style = {styles.btnText}>Go to Blood Test</Text>
        </TouchableOpacity>
    </View>
  )
}

export default Shortcut