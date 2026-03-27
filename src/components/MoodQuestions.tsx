import React, { useState, useEffect } from 'react';
import { styles } from '../styles/styles';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import { enterMood } from '../utils/dataEntry';

interface ButtonInfo
{
    id : number,
    rating : string
}

const MoodQuestions = () =>
{
    const [pleasure, setPleasure] = useState('');
    const [depress, setDepress] = useState('');
    const [pleasureState, setPState] = useState([false, false, false, false]);
    const [depressState, setDState] = useState([false, false, false, false]);
    const [allAnswered, setAnswered] = useState(false);
    const router = useRouter();

    const handleMood = async () => {
       if (!allAnswered)
        return;
       
        try
        {
            await enterMood(pleasure, depress);
            router.navigate('/vitamindtest');
        } 
        catch (error: any) 
        {
            console.error('Database entry error:', error);
        }
    };

    const RadioButton = ({id, rating} : ButtonInfo) =>
    {
        useEffect(() => 
        {
            if (allAnswered == false && pleasure != '' && depress != '')
                setAnswered(true);
        })
        const index = id % 4;
        
        const press = () =>
        {
            const newState = [false, false, false, false];

            if (id < 4 && pleasureState[index] == false)
            {
                newState[index] = !pleasureState[index];
                setPState(newState);
                setPleasure(rating);
            }
            else if(id >= 4 && depressState[index] == false)
            {
                newState[index] = !depressState[id];
                setDState(newState);
                setDepress(rating);
            }
        }

        return(
            <View>
                <TouchableOpacity 
                    key = {id}
                    style = 
                    {[
                        styles.screeningBubble, 
                        id < 4 && pleasureState[index] && styles.screeningBubbleSelected, 
                        id >= 4 && depressState[index] && styles.screeningBubbleSelected, 
                        {height: 40, width: 40, borderRadius: 40, marginLeft: 15, marginRight: 15}
                    ]}
                    onPress = {press}>
                    {id < 4 && pleasureState[index] && <View style={[styles.screeningBubbleDot, moodStyles.bubbleDot]} />}
                    {id >= 4 && depressState[index] && <View style={[styles.screeningBubbleDot, moodStyles.bubbleDot]} />}
                </TouchableOpacity>
                <Text style = {[styles.inputHeader, {textAlign: "center"}]}>{rating}</Text>
            </View>
        )
    }

    return (
        <View style = {styles.background}> 
            <Text style = {styles.inputHeader}>In the last 2 weeks, how often have you been bothered by these problems?</Text>

            <View style = {{flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 30, marginBottom: 36}}>
                <View>
                    <Text style = {[moodStyles.rateText, moodStyles.topRate]}>1: Not at all</Text>
                    <Text style = {moodStyles.rateText}>3: More than half days</Text>
                </View>
                <View>
                    <Text style = {[moodStyles.rateText, moodStyles.topRate]}>2: Several days</Text>
                    <Text style = {moodStyles.rateText}>4: Nearly everyday</Text>
                </View>
            </View>
            
            <Text style = {styles.inputHeader}>Little interest or pleasure doing things.</Text>
            <View style = {styles.screeningOptionRow} >
                <RadioButton id = {0} rating = {"1"}/>
                <RadioButton id = {1} rating = {"2"}/>
                <RadioButton id = {2} rating = {"3"}/>
                <RadioButton id = {3} rating = {"4"}/>
            </View>

            <Text style = {styles.inputHeader}>Feeling down, depressed, or hopeless.</Text>
            <View style = {styles.screeningOptionRow}>
                <RadioButton id = {4} rating = {"1"}/>
                <RadioButton id = {5} rating = {"2"}/>
                <RadioButton id = {6} rating = {"3"}/>
                <RadioButton id = {7} rating = {"4"}/>
            </View>

            <TouchableOpacity style = {[styles.blueNextButton, !allAnswered && styles.nextButtonDisabled]} onPress={handleMood}>
                <Text style = {styles.btnText}>Next</Text>
            </TouchableOpacity>
        </View>
    )
}

export default MoodQuestions;

const moodStyles = StyleSheet.create(
{
    bubbleDot: 
    {
        height: 20, 
        width: 20, 
        borderRadius: 20
    },

    rateText:
    {
        fontSize: 16
    },

    topRate:
    {
        marginBottom: 5
    }
})