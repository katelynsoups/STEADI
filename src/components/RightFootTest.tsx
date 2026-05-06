import React, { useRef, useState } from 'react';
import { styles } from '../styles/styles';
import {
    Image,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import ViewShot, {captureRef} from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system/legacy';
import { enterFootTest, getActiveSessionId, getPID } from '../utils/dataEntry';

export type buttonStats = {
    id: number;
    top: number;
    left: number;
}

export const diagramFileName : string = "RightNeuropathyDiagram.png";

const router = useRouter()

const buttonMap = new Map<number, boolean>();
//generated using gemini
const feet = require('../assets/Right_foot_test.png');

const handleFootTest = async () => {
    try{
        await enterFootTest(buttonMap, 'right');
        router.navigate('/moodquestions');
    } catch (error: any) {
        console.error('Database entry error:', error);
    }
};

const FootTest = () =>
{
    for (let i:number = 0; i < 10; i++)
        buttonMap.set(i, false)

    const diagramRef = useRef(null);

    const FootButton = (props: buttonStats) =>
    {
        const[isPressed, setPressed] = useState(true);

        const press = () =>
        {
            setPressed(!isPressed);
            buttonMap.set(props.id, isPressed);
        }

        const footStyle = StyleSheet.create(
        {
            button: {
            width: 31,
            height: 31,
            borderRadius: 30,
            borderColor: "blue",
            borderWidth: 7,
            position: "absolute"
            }
        })

        return (
            <TouchableOpacity
                key = {props.id} 
                style = { [footStyle.button, {backgroundColor: isPressed ? '#00000000' : 'blue', top: props.top, left: props.left, zIndex: 2}]}
                onPress = {press}
            /> 
        );
    
    };

    const diagramURI = async () =>
    {
        const assessmentNum = await getActiveSessionId();
        const pid = await getPID();
        try 
        {
            const uri = await captureRef(diagramRef,
            {
                format: 'png',
                quality: 0.9,
                fileName: assessmentNum + diagramFileName
            });

            const newURI : string = FileSystem.documentDirectory + pid + 'images';
            const dirCheck = await FileSystem.getInfoAsync(newURI)

            console.log(dirCheck)

            if(!dirCheck.exists)
            {
                await FileSystem.makeDirectoryAsync(newURI, { intermediates: true })
                console.log("Created directory!");
            }

            const base64 : string = await FileSystem.readAsStringAsync(uri,
            {
                encoding: FileSystem.EncodingType.Base64
            })

            await FileSystem.writeAsStringAsync(newURI + assessmentNum + diagramFileName, base64, 
            {
                encoding: FileSystem.EncodingType.Base64
            })

            console.log('Image saved successfully to:', newURI);
        }
        catch (error)
        {
            console.error('Could not get foot diagram snapshot: ', error);
        }
    }

    return (
        <View style = {styles.background}> 
            <Text style = {styles.inputHeader}>Please complete the test on the right foot and tap on the screen where the monofilament was felt.</Text>
            
            <ViewShot ref = {diagramRef} options = {{format: 'png', quality: 0.9}}>
            <View style = {{width: 375, height: 375}}>
                <Image source = {feet} style = {{width: 375, height: 375}}/>

                <FootButton id = {0} top = {38} left = {130}/>
                <FootButton id = {1} top = {45} left = {59}/>
                <FootButton id = {2} top = {90} left = {19}/>
                <FootButton id = {3} top = {110} left = {124}/>
                <FootButton id = {4} top = {105} left = {74}/>
                <FootButton id = {5} top = {140} left = {19}/>
                <FootButton id = {6} top = {210} left = {99}/>
                <FootButton id = {7} top = {220} left = {29}/>
                <FootButton id = {8} top = {305} left = {74}/>
                <FootButton id = {9} top = {160} left = {230}/>               

            </View>
            </ViewShot>

            <TouchableOpacity onPress = {() => {diagramURI(); handleFootTest()}} style = {styles.blueNextButton}>
                <Text style = {[styles.btnText]}>Next</Text>
            </TouchableOpacity>
        </View>
        
    )
}

export default FootTest;