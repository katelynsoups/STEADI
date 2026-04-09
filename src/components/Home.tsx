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
import { useTranslation } from 'react-i18next';
import { getActiveSessionId } from '../utils/dataEntry';

const Home = () =>
{
    const { t, i18n } = useTranslation();
    const router = useRouter()

    //checks if there is a parameter with the saved status - used for the screening results page
    const handleResume = async () => {
        try {
            await getActiveSessionId();
            const saved = await getSaveStatus();
            const [pathname, query] = saved.split('?');
            const params = query ? Object.fromEntries(new URLSearchParams(query)) : {};

            router.navigate({ pathname, params });
        } catch (err: any) {
            Alert.alert(t('home.errorTitle'), t('home.errorMessage'));
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

            <TouchableOpacity onPress = {() => {router.navigate('/pastassessments')}} style = {[styles.blueNextButton, {top: "15%"}]}>
                <Text style = {[styles.btnText]}>{t('home.pastAssessments')}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress = {handleResume} style = {[styles.blueNextButton, {top: '35%'}]}>
                <Text style = {[styles.btnText]}>{t('home.resume')}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress = {() => {router.navigate('/screening')}} style = {[styles.blueNextButton, {top: '55%'}]}>
                <Text style = {[styles.btnText]}>{t('home.newAssessment')}</Text>
            </TouchableOpacity>

                  <TouchableOpacity onPress = {() => router.navigate('/shortcut')} style = {[styles.blueNextButton, {top: '75%'}]}>
                    <Text style = {styles.btnText}>{t('index.shortcut')}</Text>
                  </TouchableOpacity>

            <Logout/>

        </View>
    )
}

export default Home;