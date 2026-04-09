import React from 'react';
import { styles } from '../styles/styles';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';

const router = useRouter()

const AssessComplete = () =>
{
    return (
        <View style = {styles.background}> 
            <Text style = {styles.inputHeader}>
                You will be able to view your results in about an hour through the Past Assessments page on the home screen.
            </Text>

            <TouchableOpacity onPress = {() => router.navigate('/home')} style = {[styles.blueNextButton, {bottom: 60}]}>
                <Text style = {[styles.btnText]}>End Assessment</Text>
            </TouchableOpacity>
        </View>
        
    )
}

export default AssessComplete;