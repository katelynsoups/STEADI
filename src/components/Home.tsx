import React, {useState} from 'react';
import { styles } from '../styles/styles';
import {   
    Alert,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getSaveStatus } from '../utils/saveUnit';
import Logout from './Logout';

const Home = () =>
{

    const router = useRouter()

    //checks if there is a parameter with the saved status - used for the screening results page
    const handleResume = async () => {
        try {
            const saved = await getSaveStatus();
            const [pathname, query] = saved.split('?');
            const params = query ? Object.fromEntries(new URLSearchParams(query)) : {};

            router.navigate({ pathname, params });
        } catch (err: any) {
            Alert.alert('Error', 'Could not retrieve your assessment progress.');
        }
    };

    const handleLogOut = () => 
    {
        //Need log out logic, currently sends user to index.jsx
        router.navigate('/');
    }

    //Once we have a way to determine if a user has an unfinished/past assessments, implement ways to change button placement based on state

    return (
        <View style = {styles.background}> 

            <TouchableOpacity onPress = {() => {router.navigate('/pastassessments')}} style = {[styles.blueNextButton, {top: "20%"}]}>
                <Text style = {[styles.btnText]}>View Past Assessments</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress = {handleResume} style = {[styles.blueNextButton, {top: '40%'}]}>
                <Text style = {[styles.btnText]}>Resume Assessmnets</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress = {() => {router.navigate('/screening')}} style = {[styles.blueNextButton, {top: '60%'}]}>
                <Text style = {[styles.btnText]}>Start New Assessment</Text>
            </TouchableOpacity>

            <Logout/>

        </View>
    )
}

export default Home;