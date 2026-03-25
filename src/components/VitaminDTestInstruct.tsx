import React, { useState, useEffect  } from 'react';
import { styles } from '../styles/styles';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { updateSaveStatus } from '../utils/saveUnit';
import { getVideoURL} from '../utils/videoUtils';

const VitaminDTestInstruct = ({screenId}: {screenId: string}) =>
{
    const router = useRouter()
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    useEffect(() => {
        getVideoURL(screenId).then(url => {
            if (url) setVideoUrl(url);
        });
    }, [screenId]);
    updateSaveStatus();
    
    const player = useVideoPlayer(videoUrl ?? '', player => {
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