import React, { useState } from 'react';
import { styles } from '../styles/styles';
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as ImagePicker from 'expo-image-picker';

const VisionUpload = () =>
{
    const [image, setImage] = useState<string | null>(null);
    const router = useRouter();

    const pickVideo = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if(!permissionResult.granted)
        {
            Alert.alert('Permission required', 'Permission to accesss the media library is required.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync(
            {
                mediaTypes: ['videos'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            }
        );

        console.log(result);

        if (!result.canceled)
            setImage(result.assets[0].uri);
    }

    //Swap out for video url or changed video title
    //mp4 is a large file, currently this is pulling from files and you will need to add your own to assets
    //it will eventually pull from blob storage in the db
    const visionInstruct = require('../assets/STEADItestvid.mp4');

    const player = useVideoPlayer(visionInstruct, player => {
        player.loop = false;
        player.play();
    });

    return (
        <View style = {styles.background}> 
        <Text style = {styles.inputHeader}>Watch the video tutorial for completing the vision test using your at-home kit.</Text>

        <VideoView
            player = {player}
            allowsFullscreen
            style = {styles.video}
        />

        <Text style = {styles.inputHeader}>Select "Upload" to select video or take video.</Text>

        <TouchableOpacity onPress = {pickVideo} style = {styles.blueNextButton}>
            <Text style = {[styles.btnText]}>Upload</Text>
        </TouchableOpacity>

        </View>
    )
}

export default VisionUpload;