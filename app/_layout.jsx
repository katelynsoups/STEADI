import { StyleSheet, View, Text, Platform, TouchableOpacity} from 'react-native'
import React from 'react'
import { Stack, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import Ionicons from "@expo/vector-icons/Ionicons"
import { styles } from '../src/styles/styles'

const RootLayout = () => 
{ 
  //Custom header, Stack from expo-router does NOT allow you to asjust many things about it. 
  //BUG: White flash when back button is pressed
  const CustomHeader = ({ headerText }) => (
    <View style={styles.layoutHeader}>

      <TouchableOpacity>
        <Ionicons name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back-sharp'}
          style = {styles.backBtn}
          onPress = {() => router.back()}
        />
      </TouchableOpacity>
      <Text style={styles.headerText}>{headerText}</Text>
    </View>
  );

  return (
    <>
        <StatusBar style = "light" />
        <Stack>
            <Stack.Screen name = "index" options = {{headerShown: false}}/>
            <Stack.Screen name = "login" options = {{headerShown: false}}/>
            <Stack.Screen name = "signup" options = {{
              header: () => 
                <CustomHeader headerText = "Let's get to know you better! What is your name?"/>
            }}/>
        </Stack>
    </>
  )
}

export default RootLayout