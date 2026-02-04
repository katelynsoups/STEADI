import React, { useEffect, useState, useRef } from 'react';
import { styles } from '../styles/styles';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import {buttonStats} from "../data/hazardQuestions";
import { enterHazards } from '../utils/dataEntry';

type PageData =
{
    questions : buttonStats[];
    next : string;
};

type buttonText = {text : string};

const HomeHazards: React.FC<PageData> = ({questions, next}) =>
{
    const router = useRouter();
    const hazardsMap = useRef(new Map<string, boolean>()).current;

    const handleHazards = async () => {
        try{
            await enterHazards(hazardsMap);
            router.navigate(next);
        } catch (error: any) {
            console.error('Database entry error:', error);
        }
    };

    const HazardButton: React.FC<buttonText> = ({text}) =>
    {
        const [isPressed, setPressed] = useState(true);

        const press = () =>
        {
            const newValue = !isPressed;
            setPressed(newValue);
            hazardsMap.set(text, newValue);
        }

        return (
            <TouchableOpacity onPress = {press} style = {[hazardStyle.choice, {backgroundColor: isPressed ? '#ffffff' : '#17206352'}]}>
                <Text style = {{ fontSize: 17, marginTop: "1%", marginBottom: "1%", marginLeft: "5%"}}>{text}</Text>
            </TouchableOpacity> 
        )
    }

    return (
        <View style = {styles.background}> 
            <Text style = {styles.inputHeader}>You can choose more than one:</Text>

            {/*added key options to take care of console logs*/}
            {
            questions.map((option) => (
                <HazardButton key={option.text} text={option.text}/>
            )) 
            }

            <TouchableOpacity onPress = {handleHazards} style = {styles.blueNextButton}>
                <Text style = {[styles.btnText]}>Next</Text>
            </TouchableOpacity>
        </View>
        
        )
}

export default HomeHazards;

const hazardStyle = StyleSheet.create({
    choice :
    {
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        borderColor: '#EDF1F3',
        borderWidth: 1,
        position: 'static',
        width: "95%",
        marginTop: 16
    }
})