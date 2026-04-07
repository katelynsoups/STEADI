import React, { useState, useEffect } from 'react';
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
import { getVideoURL} from '../utils/videoUtils';

const BloodTest = ({screenId}: {screenId: string}) =>
{
  const [sysStanding, setFirstStand] = useState('');
  const [diaStanding, setLastStand] = useState('');
  const [sysLying, setFirstLying] = useState('');
  const [diaLying, setLastLying] = useState('');

  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  //const [filter, setFilter] = useState(''); 

  useEffect(() => {
          getVideoURL(screenId).then(url => {
              if (url) setVideoUrl(url);
          });
      }, [screenId]);

  const handleBP = async () => {
    
    if((sysStanding == null) || (diaStanding == null) || (sysLying == null) || (diaLying == null))
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

      let standingBP = `${sysStanding}/${diaStanding}`;
      let lyingBP = `${sysStanding}/${diaLying}`;
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

  const player = useVideoPlayer(videoUrl ?? '', player => {
      player.loop = false;
      player.play();
  });

  return (
    <View style={{ flex: 1 }}>
    <KeyboardAwareScrollView contentContainerStyle = {[styles.background, styles.keyboardScroll]} enableOnAndroid = {true}  enableAutomaticScroll = {true}>
      <Text style = {styles.inputHeader}>Watch the video tutorial on how to use your at-home kit blood pressure reader.</Text>

      <VideoView
        player = {player}
        allowsFullscreen
        style = {styles.video}
      />

    {/* Standing BP */}
      <View style={bt.card}>
        <Text style={bt.cardTitle}>Standing Blood Pressure</Text>
        <View style={bt.inputGroup}>
          <Text style={bt.label}>SYS: </Text>
          <TextInput
            style={bt.input}
            value={sysStanding}
            onChangeText={setFirstStand}
            placeholder="120"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
        </View>
        <View style={bt.inputGroup}>
          <Text style={bt.label}>DIA: </Text>
          <TextInput
            style={bt.input}
            value={diaStanding}
            onChangeText={setLastStand}
            placeholder="80"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Lying BP */}
      <View style={[bt.card, { marginBottom: 150 }]}>
        <Text style={bt.cardTitle}>Lying Blood Pressure</Text>
        <View style={bt.inputGroup}>
          <Text style={bt.label}>SYS: </Text>
          <TextInput
            style={bt.input}
            value={sysLying}
            onChangeText={setFirstLying}
            placeholder="120"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
        </View>
        <View style={bt.inputGroup}>
          <Text style={bt.label}>DIA: </Text>
          <TextInput
            style={bt.input}
            value={diaLying}
            onChangeText={setLastLying}
            placeholder="80"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
        </View>
      </View>
    </KeyboardAwareScrollView>

    <TouchableOpacity onPress = {() => {player.pause(); handleBP();}} style = {styles.blueNextButton}>
      <Text style = {[styles.btnText]}>Next</Text>
    </TouchableOpacity>
    </View>
    
  )
}


const bt = StyleSheet.create({
  card: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 14,
  },

  inputGroup: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },

  label: {
    fontSize: 17,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 6,
    textTransform: 'uppercase',
  },

  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    width: '80%',
  },
});

export default BloodTest;