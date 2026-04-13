import React, { useState, useEffect  } from 'react';
import { styles } from '../styles/styles';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { getVideoURL} from '../utils/videoUtils';

export type screenVars = {
    text1 : string,
    text2 : string,
    screenId :string,
    nextRoute : string,
};

const VideoInstruction: React.FC<screenVars> = ({text1, text2, screenId, nextRoute}) =>
{
    const router = useRouter()
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getVideoURL(screenId).then(url => {
            if (url) setVideoUrl(url);
            setIsLoading(false);
        });
    }, [screenId]);
    
    const player = useVideoPlayer(videoUrl ?? '', player => {
        player.loop = false;
        player.play();
    });

    return (
        <View style = {styles.background}> 
            <Text style = {styles.inputHeader}>{text1}</Text>

            {isLoading ? (
                <View style={[styles.video, { 
                    width: '95%',
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
                    style={[styles.video]}
                />
            )}

            <Text style={styles.inputHeader}>{text2}</Text>


            <TouchableOpacity onPress = {() => {player.pause(); router.navigate(nextRoute)}} style = {styles.blueNextButton}>
                <Text style = {[styles.btnText]}>Next</Text>
            </TouchableOpacity>
        </View>
        
    )
}

export default VideoInstruction;