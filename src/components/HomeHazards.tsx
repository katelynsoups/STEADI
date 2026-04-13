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
import { getHazards } from '../utils/getData';
import { LoadingModal } from './LoadingModal';

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
    const [ready, isReady] = useState(false);
    
    const handleHazards = async () => {
        try{
            await enterHazards(hazardsMap);
        } catch (error: any) {
            console.error('Database entry error:', error);
        }
    };

    useEffect(() => {
        for (let i = 0; i < questions.length; i++)
            hazardsMap.set(questions[i].text, false);

        getHazards().then(hazards =>
        {
          if(hazards)
          {
            
            for (const [key, value] of Object.entries(hazards))
            {
                hazardsMap.set(key, value);
            }
          }
        }).then(ignore => 
        {
          isReady(true);
        })
      }, []);

    const HazardButton: React.FC<buttonText> = ({text}) =>
    {
        const [change, makeChange] = useState(false);

        console.log(text, " ", hazardsMap.get(text))

        const press = () =>
        {
            hazardsMap.set(text, !hazardsMap.get(text));
            makeChange(!change);
            handleHazards();
        }

        if(ready)
        {
            return (
                <TouchableOpacity onPress = {press} style = {[hazardStyle.choice, {backgroundColor: hazardsMap.get(text) ? '#17206352' : '#ffffff'}]}>
                    <Text style = {{ fontSize: 17, marginTop: "1%", marginBottom: "1%", marginLeft: "5%"}}>{text}</Text>
                </TouchableOpacity>
            )
        }
    }

    return (
        <View style = {styles.background}> 
            <LoadingModal ready = {ready} title = {"Loading Module..."} message = {""}/>

            <Text style = {styles.inputHeader}>You can choose more than one:</Text>

            {/*added key options to take care of console logs*/}
            {
            questions.map((option) => (
                <HazardButton key={option.text} text={option.text}/>
            )) 
            }

            <TouchableOpacity onPress = {() => router.navigate(next)} style = {styles.blueNextButton}>
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