
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
  const bloodInstruct = require('../assets/STEADItestvid.mp4');

  const player = useVideoPlayer(bloodInstruct, player => {
    player.loop = false;
    player.play();
  });

  return (
    <View style = {styles.background}> 
      <Text style = {styles.inputHeader}>Watch the video tutorial on how to use your at-home kit blood pressure reader.</Text>

      <VideoView
        player = {player}
        allowsFullscreen
        style = {styles.video}
      />

      <View style = {[{width: "100%"}, {marginBottom: 8}]}><Text style = {styles.inputHeader}>Standing Blood Pressure:</Text>
        <TextInput
          style={[styles.input, {backgroundColor: "white"}]}
        />
      </View>
      <View style = {[{width: "100%"}, {marginBottom: 8}]}><Text style = {styles.inputHeader}>Lying Down Blood Pressure:</Text>
        <TextInput
          style={[styles.input, {backgroundColor: "white"}]}
        />
      </View>

      <TouchableOpacity style = {[styles.btn, {position: "static", marginTop: 16}]}>
        <Text style = {[styles.btnText]}>Next</Text>
      </TouchableOpacity>
    </View>
    
    )
}

export default BloodTest;
