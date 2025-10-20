import { StyleSheet, Text, View, ImageBackground} from 'react-native'
import { Colors } from '../constants/Colors' 
import Shield from '../assets/Shield.png'
import STDBtn from '../components/STDBtn'
import React from 'react'
import { addUserAuto } from '../src/firebase'

const index = () => 
{

  const tempSubmit = () =>
  {
    console.log("button pressed")
  }

  return (
    <View style = {styles.container}>
      <ImageBackground source = {Shield} style = {styles.shield}>
        <Text style = {styles.tempText}>STEADI</Text>
      </ImageBackground>
      
      <STDBtn onPress = {tempSubmit} style = {styles.btn}>
        <Text style = {styles.btnText}>Get Started</Text>
      </STDBtn>

    </View>
  )
}

export default index

const styles = StyleSheet.create(
{
  container:
  {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    flex: 1,
    //justifyContent: 'center'
  },

  btn:
  {
    justifyContent: 'center',
    top: "73.55%"
  },

  btnText:
  {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    textColor: "#ffffff",
  },

  tempText:
  {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 48,
    textAlign: 'center',
  },

  shield: 
  {
    height: 217,
    justifyContent: 'center',
    top: '34.54%',
    width: 218
  }
})