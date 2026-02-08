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
  const [standingBP, setStandingBP] = useState('');
  const [lyingBP, setLyingBP] = useState('');
  const router = useRouter();

  const handleBP = async () => {
    let finalStand = standingBP.match(/(0|[1-9][0-9]*)\/(0|[1-9][0-9]*)/);
    let finalRest = lyingBP.match(/(0|[1-9][0-9]*)\/(0|[1-9][0-9]*)/);

    if((finalStand == null) || (finalRest == null) || standingBP !== finalStand[0] || lyingBP !== finalRest[0])
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

      console.log(`STANDING ENTERED: ${standingBP} STANDING REGEX: ${finalStand}`);
      console.log(`LYING ENTERED: ${lyingBP} LYING REGEX: ${finalRest}`);
    }

    try{
      await enterBP(standingBP, lyingBP);
      router.navigate('/visionupload');
    } catch (error: any) {
      console.error('Database entry error:', error);
    }
  };

  const checkStandingBP = (pressure:string) => {
    const newPressure = pressure.replace(/[^0-9\/]/gm, '');
    setStandingBP(newPressure);
  }

  const checkLyingBP = (pressure:string) => {
    const newPressure = pressure.replace(/[^0-9\/]/gm, '');
    setLyingBP(newPressure);
  }

  //Swap out for video url or changed video title
  //mp4 is a large file, currently this is pulling from files and you will need to add your own to assets
  //it will eventually pull from blob storage in the db
  const bloodInstruct = require('../assets/STEADItestvid.mp4');

  const player = useVideoPlayer(bloodInstruct, player => {
    player.loop = false;
    player.play();
  });

  return (
    <KeyboardAwareScrollView contentContainerStyle = {[styles.background, {flex: 0, flexGrow: 1}]} enableOnAndroid = {true}  enableAutomaticScroll = {true}>
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
          onChangeText={checkStandingBP}
          placeholder="120/80"
          placeholderTextColor="#6B7280"
        />
      </View>
      <View style = {[{width: "95%"}, {marginBottom: 8}]}><Text style = {styles.inputHeader}>Lying Down Blood Pressure:</Text>
        <TextInput
          style={[styles.input, {backgroundColor: "white"}]}
          value={lyingBP}
          onChangeText={checkLyingBP}
          placeholder="120/80"
          placeholderTextColor="#6B7280"
        />
      </View>

      <TouchableOpacity onPress ={() => {player.pause(); handleBP();}} style = {styles.blueNextButton}>
        <Text style = {[styles.btnText]}>Next</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
    
    )
}

export default BloodTest;