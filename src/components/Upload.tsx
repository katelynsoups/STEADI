import React, { useState, useEffect } from 'react';
import { styles } from '../styles/styles';
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as ImagePicker from 'expo-image-picker';
import { extractAudio } from 'expo-video-audio-extractor';
import * as FileSystem from 'expo-file-system/legacy';
import { getVideoURL} from '../utils/videoUtils';
import { transcribeAudio } from '../utils/transcribeAudio';
import { enterVisionTest } from '../utils/dataEntry';
import { uploadTugVideo } from '../utils/videoUpload';

type uploadType = 
{
    //Vision or Walking, determines where video gets sent for processing
    test : string,
    text : string,
    boldPhrase?: string,
    screenId :string,
    route : string,
    side?: 'left' | 'right', //for the vision exam

};

const Upload : React.FC <uploadType> = ({test, text, boldPhrase, screenId, route, side}) =>
{
    const [vision, setVision] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getVideoURL(screenId).then(url => {
            if (url) setVideoUrl(url);
            setIsLoading(false);
        });
    }, [screenId]);

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

        if (!result.canceled)
        {
            //URI points to cache, which is temporary. Users may need to re-upload the video to server if session is interrupted.
            setVision(result.assets[0].uri);
            console.log('[Upload] Video selected from gallery:', result.assets[0].uri);
            if(test === 'vision'){
                setUploading(true);
                try {
                    await processVideoToAudio(result.assets[0].uri, side); // only perform mp4 -> wav if the test type is vision
                } catch (err) {
                    Alert.alert('Upload failed', 'Could not upload video. Please try again.');
                    setUploading(false);
                    return;
                }
                setUploading(false);
            }
            if (test === 'walking') {
                setUploading(true);
                setUploadProgress(0);
                try {
                    await uploadTugVideo(result.assets[0].uri, (pct) => {
                        setUploadProgress(pct);
                    });
                } catch (err) {
                    Alert.alert('Upload failed', 'Could not upload video. Please try again.');
                    setUploading(false);
                    return;
                }
                setUploading(false);
            }
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

        if (!result.canceled)
        {
            setVision(result.assets[0].uri);
            console.log('[Upload] Video captured from camera:', result.assets[0].uri);
            if(test === 'vision'){
                setUploading(true);
                try {
                    await processVideoToAudio(result.assets[0].uri, side); // only perform mp4 -> wav if the test type is vision
                } catch (err) {
                    Alert.alert('Upload failed', 'Could not upload video. Please try again.');
                    setUploading(false);
                    return;
                }
                setUploading(false);
            }
            if (test === 'walking') {
                setUploading(true);
                setUploadProgress(0);
                try {
                    await uploadTugVideo(result.assets[0].uri, (pct) => {
                        setUploadProgress(pct);
                    });
                } catch (err) {
                    Alert.alert('Upload failed', 'Could not upload video. Please try again.');
                    setUploading(false);
                    return;
                }
                setUploading(false);
            }
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

    //prevent auto play of vision assessment
    const player = useVideoPlayer(test === 'walking' ? (videoUrl ?? '') : '', player => {
        if (test === 'walking') {
            player.loop = false;
            player.play();
        }
    });

    // uses expo-video-audio-extractor 3rd party dependency to convert uploaded mp4 -> wav
    // FIXME: store wav in cache and ensure it deletes off local storage / store somewhere else temporarily
    const processVideoToAudio = async (videoUri: string, side?: 'left' | 'right') => {
        console.log('[Upload] Starting video->audio processing');
        console.log('[Upload] Input video uri:', videoUri);

        try {
            const baseDir = FileSystem.documentDirectory ?? FileSystem.cacheDirectory;
            if (!baseDir) throw new Error('FileSystem base directory is not available');
            const assetsAudioDir = `${baseDir}assets/audio/`;
            await FileSystem.makeDirectoryAsync(assetsAudioDir, { intermediates: true });

            const audioFileName = `audio-${Date.now()}.wav`;
            const outputUri = `${assetsAudioDir}${audioFileName}`;
            const rawOutputPath = outputUri.replace('file://', '').replace(/^\/+/, '/');

            try {
                const videoInfo = await FileSystem.getInfoAsync(videoUri);
                console.log('[Upload] Video read/info result:', videoInfo);
                if (videoInfo.exists) {
                    console.log('[Upload] Video uploaded/readable successfully (for extraction).');
                }
            } catch (e) {
                console.log('[Upload] Video info check skipped/failed:', e);
            }

            console.log('[Upload] Extracting audio to:', outputUri);
            const savedAudioUri = await extractAudio({
                video: videoUri,
                output: rawOutputPath,
                format: 'wav',
            });

            console.log('[Upload] transformVideo completed. Saved audio uri:', savedAudioUri);
            console.log('[Upload] Audio file saved successfully (extractAudio returned):', savedAudioUri);

            const verifyUri = savedAudioUri.startsWith('file://')
                ? savedAudioUri
                : `file://${savedAudioUri}`;

            try {
                const outInfo = await FileSystem.getInfoAsync(verifyUri);
                console.log('[Upload] Audio output info:', outInfo);
                if (outInfo.exists) {
                    console.log('[Upload] Audio file saved successfully:', verifyUri);
                } else {
                    console.log('[Upload] Audio output reported missing:', verifyUri);
                }
            } catch (e) {
                console.log('[Upload] Audio output verification failed:', e);
                console.log('[Upload] Audio file saved successfully (unverified):', verifyUri);
            }

            const transcription = await transcribeAudio(verifyUri);
            console.log('[Upload] Transcription:', transcription);
            await enterVisionTest(transcription, side ?? 'left');

            return verifyUri;
        } catch (err) {
            console.log('[Upload] transformVideo (video->audio) failed:', err);
            Alert.alert('Upload failed', 'Failed to process video/audio.');
            throw err;
        }
    };

    return (
        <View style = {styles.background}> 
        <Text style={styles.inputHeader}>
            {boldPhrase && text.includes(boldPhrase)
                ? <>
                    {text.split(boldPhrase)[0]}
                    <Text style={{ fontWeight: 'bold' }}>{boldPhrase}</Text>
                    {text.split(boldPhrase)[1]}
                </>
                : text
            }
        </Text>

        {test === 'walking' && (
            isLoading ? (
                <View style={[styles.video, {
                    width: '95%',
                    aspectRatio: 16/9,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: '#2196F3',
                    borderRadius: 8,
                    backgroundColor: '#f0f0f0'
                }]}>
                    <ActivityIndicator size="large" color="#2196F3" />
                    <Text style={{ marginTop: 8, color: '#666' }}>Loading video...</Text>
                </View>
            ) : (
                <VideoView
                    player={player}
                    allowsFullscreen
                    style={[styles.video, { width: '95%', aspectRatio: 16/9 }]}
                />
            )
        )}

        <Text style = {styles.inputHeader}>Select "Upload" to select video or take video.</Text>

        <TouchableOpacity onPress = {cameraOrGallery} style = {styles.blueNextButton}>
            <Text style = {[styles.btnText]}>Upload</Text>
        </TouchableOpacity>

        {uploading && (
            <View style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 32,
                    alignItems: 'center',
                    width: '75%',
                    marginBottom: 270
                }}>
                    <ActivityIndicator size="large" color="#2196F3" />
                    <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 16 }}>
                        Uploading Video
                    </Text>
                    <Text style={{ color: '#666', marginTop: 8, textAlign: 'center' }}>
                        Please keep the app open while your video uploads.
                    </Text>
                </View>
            </View>
        )}

        </View>
    )
}

export default Upload;