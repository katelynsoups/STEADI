import { StyleSheet} from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const RootLayout = () => 
{

  return (
    <>
        <StatusBar style = "light" />
        <Stack screenOptions = 
        {{
            headerStyle: {backgroundColor:'#B14B02'},
            //headerTintColor:
        }}>
            <Stack.Screen name = "index" options = {{headerShown: false}}/>
            <Stack.Screen name = "login" options = {{headerShown: false}}/>
        </Stack>
    </>
  )
}

export default RootLayout

const styles = StyleSheet.create({})