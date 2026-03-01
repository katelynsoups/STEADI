import React, { useState } from 'react';
import { styles } from '../styles/styles';
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { enterBP } from '../utils/dataEntry';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const BloodTest = () =>
{
  const [firstStand, setFirstStand] = useState('');
  const [lastStand, setLastStand] = useState('');
  const [firstLying, setFirstLying] = useState('');
  const [lastLying, setLastLying] = useState('');
  const [filter, setFilter] = useState('');
  const router = useRouter();

  const handleBP = async () => {
    
    if((firstStand == null) || (lastStand == null) || (firstLying == null) || (lastLying == null))
    {
      Alert.alert(
        "Missing Input",
        "Please ensure all fields have been filled.",
          [
            {
              text: "Try Again",
              style: "cancel"
            },
          ],
        { cancelable: true }
      );
    }

      let standingBP = `${firstStand}/${lastStand}`;
      let lyingBP = `${firstLying}/${lastLying}`;
      let filterStand = standingBP.match(/(0|[1-9][0-9]*)\/(0|[1-9][0-9]*)/);
      let filterLying = lyingBP.match(/(0|[1-9][0-9]*)\/(0|[1-9][0-9]*)/);

      if(filterStand == null || filterLying == null || standingBP !== filterStand[0] || lyingBP !== filterLying[0])
      {
        Alert.alert(
          "Incorrect Format",
          "The blood pressure you entered is in an incorrect format. Please try again.",
            [
              {
                text: "Try Again",
                style: "cancel"
              },
            ],
          { cancelable: true }
        );

        console.log(`STANDING ENTERED: ${standingBP} STANDING REGEX: ${filterStand}`);
        console.log(`LYING ENTERED: ${lyingBP} LYING REGEX: ${filterLying}`);
        return;
      }

      try
      {
        await enterBP(standingBP, lyingBP);
        router.navigate('/medicationupload');
      } 
      catch (error: any) 
      {
        console.error('Database entry error:', error);
      }
  };

  //Swap out for video url or changed video title
  //mp4 is a large file, currently this is pulling from files and you will need to add your own to assets
  //it will eventually pull from blob storage in the db
  const bloodInstruct = require('../assets/STEADItestvid.mp4');

  const player = useVideoPlayer(bloodInstruct, player => {
    player.loop = false;
    player.play();
  });

  return (
    <KeyboardAwareScrollView contentContainerStyle = {[styles.background, styles.keyboardScroll]} enableOnAndroid = {true}  enableAutomaticScroll = {true}>
      <Text style = {styles.inputHeader}>Watch the video tutorial on how to use your at-home kit blood pressure reader.</Text>

      <VideoView
        player = {player}
        allowsFullscreen
        style = {styles.video}
      />

      <View style = {{flexDirection: 'row', justifyContent: 'center'}}>
        <View style = {bt.textbox}>
          <Text style = {[styles.inputHeader, {fontSize: 15}]}>Standing Blood Pressure</Text>

          <TextInput
            style={[styles.input, bt.innerText]}
            value={firstStand}
            onChangeText={setFirstStand}
            placeholder="120"
            placeholderTextColor="#6B7280"
            keyboardType= "numeric"
          />
          <TextInput
            style={[styles.input, bt.innerText]}
            value={lastStand}
            onChangeText={setLastStand}
            placeholder="80"
            placeholderTextColor="#6B7280"
            keyboardType= "numeric"
          />

        </View>

        <View style = {bt.textbox}>
          <Text style = {[styles.inputHeader, {fontSize: 15}]}>Lying Down Blood Pressure</Text>
          
          <TextInput
            style={[styles.input, bt.innerText]}
            value={firstLying}
            onChangeText={setFirstLying}
            placeholder="120"
            placeholderTextColor="#6B7280"
            keyboardType= "numeric"
          />
          <TextInput
            style={[styles.input, bt.innerText]}
            value={lastLying}
            onChangeText={setLastLying}
            placeholder="80"
            placeholderTextColor="#6B7280"
            keyboardType= "numeric"
          />

        </View>
      </View>

      <TouchableOpacity onPress = {() => {player.pause(); handleBP();}} style = {styles.blueNextButton}>
        <Text style = {[styles.btnText]}>Next</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
    
  )
}

const bt = StyleSheet.create (
{
  textbox: 
  {
    marginBottom: 8, 
    display: 'flex', 
    width: "45%"
  },

  innerText:
  {
    backgroundColor: "white", 
    width: "60%"
  }
})

export default BloodTest;