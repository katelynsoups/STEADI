import React, { useState, useEffect } from 'react';
import { styles } from '../styles/styles';
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView, VideoSource } from 'expo-video';
import * as ImagePicker from 'expo-image-picker';

type uploadType = 
{
    //Vision or Walking, determines where video gets sent for processing
    test : string,
    text : string,
    vid : VideoSource,
    route : string,

};

const Upload : React.FC <uploadType> = ({test, text, vid, route}) =>
{
    const [vision, setVision] = useState<string | null>(null);
    const router = useRouter();

    const pickVideo = async () => 
    {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        console.log(permissionResult);

        if(!permissionResult.granted)
        {
            Alert.alert('Permission required', 'Permission to accesss the media library is required.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync(
            {
                mediaTypes: ['videos'],
                allowsEditing: true,
                quality: 1,
            }
        );

        //Debugging purposes, delete later
        console.log(result);

        if (!result.canceled)
        {
            //URI points to cache, which is temporary. Users may need to re-upload the video to server if session is interrupted.
            setVision(result.assets[0].uri);
            router.navigate(route);
        }
    }

    const takeVideo = async () => 
    {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        console.log(permissionResult);

        if(!permissionResult.granted)
        {
            Alert.alert('Permission required', 'Permission to accesss your camera is required.');
            return;
        }

        let result = await ImagePicker.launchCameraAsync(
            {
                mediaTypes: ['videos'],
                allowsEditing: true,
                quality: 1,
            }
        );

        //Debugging purposes, delete later
        console.log(result);

        if (!result.canceled)
        {
            //URI points to cache, which is temporary. Users may need to re-upload the video to server if session is interrupted.
            setVision(result.assets[0].uri);
            router.navigate(route);
        }
    }

    const cameraOrGallery = () =>
    {
        Alert.alert(
            "Select Image Source",
            "How would you like to upload your assessment?",
            [
                {
                    text: "Gallery",
                    onPress: () => pickVideo(),
                },

                {
                    text: "Camera",
                    onPress: () => takeVideo(),
                },

                {
                    text: "Cancel",
                    style: "cancel"
                },
            ],
            { cancelable: true }
        );
    };


    //Swap out for video url or changed video title
    //mp4 is a large file, currently this is pulling from files and you will need to add your own to assets
    //it will eventually pull from blob storage in the db

    const player = useVideoPlayer(vid, player => {
        player.loop = false;
        player.play();
    });

    return (
        <View style = {styles.background}> 
        <Text style = {styles.inputHeader}>{text}</Text>

        <VideoView
            player = {player}
            allowsFullscreen
            style = {styles.video}
        />

        <Text style = {styles.inputHeader}>Select "Upload" to select video or take video.</Text>

        <TouchableOpacity onPress = {cameraOrGallery} style = {styles.blueNextButton}>
            <Text style = {[styles.btnText]}>Upload</Text>
        </TouchableOpacity>

        </View>
    )
}

export default Upload;
