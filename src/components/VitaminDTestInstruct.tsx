import React, { useState } from 'react';
import { styles } from '../styles/styles';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { updateSaveStatus } from '../utils/saveUnit';

const VitaminDTestInstruct = () =>
{

    const router = useRouter()

    //Swap out for video url or changed video title
    //mp4 is a large file, currently this is pulling from files and you will need to add your own to assets
    //it will eventually pull from blob storage in the db
    const vitaminDInstruct = require('../assets/STEADItestvid.mp4');
    updateSaveStatus();
    
    const player = useVideoPlayer(vitaminDInstruct, player => {
        player.loop = false;
        player.play();
    });

    return (
        <View style = {styles.background}> 
            <Text style = {styles.inputHeader}>Watch the video tutorial on how to asses your vitamin D level.</Text>

            <VideoView
                player = {player}
                allowsFullscreen
                style = {styles.video}
            />

            <Text style = {styles.inputHeader}>Once completed, set the test aside for later. 
    Results take approximately 20 minutes to appear.</Text>

            <TouchableOpacity onPress = {() => {player.pause(); router.navigate('/bloodtest')}} style = {styles.blueNextButton}>
                <Text style = {[styles.btnText]}>Next</Text>
            </TouchableOpacity>
        </View>
        
    )
}

export default VitaminDTestInstruct;