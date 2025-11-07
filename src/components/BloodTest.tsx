import React, { useState } from 'react';
import Video from 'react-native-video';
import { styles } from '../styles/styles';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

//Swap out for video url or changed video title
import bloodInstruct from '../assets/STEADItestvid.mp4';

const BloodTest = () =>
{
    return (
        <View style = {styleSU.background}> 
            <Text>Watch the video tutorial on how to use your at-home kit blood pressure reader.</Text>
             <Video
                source = {bloodInstruct}
                paused = {false}
                controls = {true}
                style={styleSU.backgroundVideo}
             />
        </View>
    )
}

export default BloodTest;

const styleSU = StyleSheet.create( 
{
    background:
    {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F6F8FA'
    },

    backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});