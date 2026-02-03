import React, { useState } from 'react';
import { styles } from '../styles/styles';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { enterBP } from '../utils/dataEntry';

const BloodTest = () =>
{
  const [standingBP, setStandingBP] = useState('');
  const [lyingBP, setLyingBP] = useState('');
  const router = useRouter()

  const handleEntry = async () => {
    try{
      await enterBP(standingBP, lyingBP);
      router.navigate('/homehazards');
    } catch (error: any) {
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
    <View style = {styles.background}> 
      <Text style = {styles.inputHeader}>Watch the video tutorial on how to use your at-home kit blood pressure reader.</Text>

      <VideoView
        player = {player}
        allowsFullscreen
        style = {styles.video}
      />

      <View style = {[{width: "95%"}, {marginBottom: 8}]}><Text style = {styles.inputHeader}>Standing Blood Pressure:</Text>
        <TextInput
          style={[styles.input, {backgroundColor: "white"}]}
          value={standingBP}
          onChangeText={setStandingBP}
          placeholder="120/80"
          placeholderTextColor="#6B7280"
        />
      </View>
      <View style = {[{width: "95%"}, {marginBottom: 8}]}><Text style = {styles.inputHeader}>Lying Down Blood Pressure:</Text>
        <TextInput
          style={[styles.input, {backgroundColor: "white"}]}
          value={lyingBP}
          onChangeText={setLyingBP}
          placeholder="120/80"
          placeholderTextColor="#6B7280"
        />
      </View>

      <TouchableOpacity onPress ={() => {player.pause(); handleEntry();}} style = {styles.blueNextButton}>
        <Text style = {[styles.btnText]}>Next</Text>
      </TouchableOpacity>
    </View>
    
    )
}

export default BloodTest;