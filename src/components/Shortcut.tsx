import { StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import React from 'react'    
import { useRouter } from 'expo-router'
import {styles} from '../styles/styles'

const Shortcut = () => 
{

    const router = useRouter()

  return (
    <View style = {{flex: 1}}>
        <TouchableOpacity onPress = {() => router.navigate('/screening')}style={[styles.btn, styles.inxBtn]}>
            <Text style = {styles.btnText}>Test screening pages</Text>
        </TouchableOpacity>
    </View>
  )
}

export default Shortcut