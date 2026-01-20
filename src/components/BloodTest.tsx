import React, { useState } from 'react';
import { styles } from '../styles/styles';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

const BloodTest = () =>
{

  //Swap out for video url or changed video title
  //mp4 is a large file, currently this is pulling from files and you will need to add your own to assets
  //it will eventually pull from blob storage in the db
  // const bloodInstruct = require('../assets/STEADItestvid.mp4');
  const bloodInstruct = require('../assets/test_vid.mp4');

  const player = useVideoPlayer(bloodInstruct, player => {
    player.loop = false;
    player.play();
  });

  return (
    <View style = {styles.background}> 
      <Text testID="bloodTestHeader" style = {styles.inputHeader}>Watch the video tutorial on how to use your at-home kit blood pressure reader.</Text>

      <VideoView
        testID="bloodTestVideo"
        player = {player}
        allowsFullscreen
        style = {styles.video}
      />

      <View style = {[{width: "100%"}, {marginBottom: 8}]}><Text style = {styles.inputHeader}>Standing Blood Pressure:</Text>
        <TextInput
          testID="standingInput"
          style={[styles.input, {backgroundColor: "white"}]}
        />
      </View>
      <View style = {[{width: "100%"}, {marginBottom: 8}]}><Text style = {styles.inputHeader}>Lying Down Blood Pressure:</Text>
        <TextInput
          testID="lyingInput"
          style={[styles.input, {backgroundColor: "white"}]}
        />
      </View>

      <TouchableOpacity testID="nextButton" style = {[styles.btn, {position: "static", marginTop: 16}]}>
        <Text style = {[styles.btnText]}>Next</Text>
      </TouchableOpacity>
    </View>
    
    )
}

export default BloodTest;