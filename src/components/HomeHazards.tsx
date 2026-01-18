import React, { useEffect, useState } from 'react';
import { styles } from '../styles/styles';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import {buttonStats} from "../data/hazardQuestions";

type PageData =
{
    questions : buttonStats[];
    next : string;
};

type buttonText = {text : string};

const HomeHazards: React.FC<PageData> = ({questions, next}) =>
{
    const router = useRouter();
    const hazardsMap = new Map<string, boolean>();

    const HazardButton: React.FC<buttonText> = ({text}) =>
    {
        const [isPressed, setPressed] = useState(true);

        const press = () =>
        {
            setPressed(!isPressed);
            hazardsMap.set(text, isPressed);
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

            {
                questions.map((option) => (
                    <HazardButton text = {option.text}/>      
                )) 
            }

            <TouchableOpacity onPress = {() => {router.navigate(next)}} style = {[styles.btn, {position: "absolute", top: 450}]}>
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