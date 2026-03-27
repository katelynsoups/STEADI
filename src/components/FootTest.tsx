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
import { enterFootTest } from '../utils/dataEntry';

export type buttonStats = {
    id: number;
    top: number;
    left: number;
}

export const diagramFileName : string = "NeuropathyDiagram.png";

const router = useRouter()

const buttonMap = new Map<number, boolean>();
//source @ https://www.vecteezy.com/vector-art/5218154-footprint-heel-the-black-color-icon, look into whether I need to attribute or pay a sub for image
const feet = require('../assets/FootTest.png');

const handleFootTest = async () => {
    try{
        await enterFootTest(buttonMap);
        router.navigate('/moodquestions');
    } catch (error: any) {
        console.error('Database entry error:', error);
    }
};

const FootTest = () =>
{
    for (let i:number = 0; i < 20; i++)
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

        try 
        {
            const uri = await captureRef(diagramRef,
            {
                format: 'png',
                quality: 0.9,
                fileName: diagramFileName
            });

            const newURI : string = FileSystem.documentDirectory + 'images';
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

            await FileSystem.writeAsStringAsync(newURI + diagramFileName, base64, 
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
            <Text style = {styles.inputHeader}>When the patient feels the monofilament touching their feet, instruct them to tap on the screen where it was felt.</Text>
            
            <ViewShot ref = {diagramRef} options = {{format: 'png', quality: 0.9}}>
            <View style = {{width: 375, height: 375}}>
                <Image source = {feet} style = {{width: 375, height: 375}}/>

                <FootButton id = {0} top = {83} left = {32}/>
                <FootButton id = {1} top = {46} left = {67}/>
                <FootButton id = {2} top = {24} left = {117}/>
                <FootButton id = {3} top = {65} left = {107}/>
                <FootButton id = {4} top = {132} left = {50}/>
                <FootButton id = {5} top = {105} left = {85}/>
                <FootButton id = {6} top = {105} left = {125}/>
                <FootButton id = {7} top = {195} left = {67}/>
                <FootButton id = {8} top = {180} left = {115}/>
                <FootButton id = {9} top = {300} left = {110}/>                

                <FootButton id = {10} top = {24} left = {228}/> 
                <FootButton id = {11} top = {46} left = {275}/> 
                <FootButton id = {12} top = {83} left = {310}/>
                <FootButton id = {13} top = {65} left = {240}/>  
                <FootButton id = {14} top = {105} left = {219}/>
                <FootButton id = {15} top = {105} left = {260}/>  
                <FootButton id = {16} top = {132} left = {295}/> 
                <FootButton id = {17} top = {180} left = {226}/> 
                <FootButton id = {18} top = {195} left = {276}/> 
                <FootButton id = {19} top = {300} left = {235}/> 

            </View>
            </ViewShot>

            <TouchableOpacity onPress = {() => {diagramURI(); handleFootTest()}} style = {styles.blueNextButton}>
                <Text style = {[styles.btnText]}>Next</Text>
            </TouchableOpacity>
        </View>
        
    )
}

export default FootTest;