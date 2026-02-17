import React, { useState } from 'react';
import { styles } from '../styles/styles';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { updateSaveStatus } from '../utils/saveUnit';

const FootTestInstruct = () =>
{

    const router = useRouter()

    //Swap out for video url or changed video title
    //mp4 is a large file, currently this is pulling from files and you will need to add your own to assets
    //it will eventually pull from blob storage in the db
    const footInstruct = require('../assets/STEADItestvid.mp4');

    updateSaveStatus();
    
    const player = useVideoPlayer(footInstruct, player => {
        player.loop = false;
        player.play();
    });

    return (
        <View style = {styles.background}> 
        <Text style = {styles.inputHeader}>Watch the video tutorial on how to use your at-home monofilament to test neuropathy.</Text>

        <VideoView
            player = {player}
            allowsFullscreen
            style = {styles.video}
        />

        <TouchableOpacity onPress = {() => {player.pause(); router.navigate('/foottest')}} style = {styles.blueNextButton}>
            <Text style = {[styles.btnText]}>Next</Text>
        </TouchableOpacity>
        </View>
        
    )
}

export default FootTestInstruct;