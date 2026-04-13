import React from 'react';
import { styles } from '../styles/styles';
import {
    View,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { completeSession } from '../utils/dataEntry';


const AssessComplete = () =>
{
    const router = useRouter();
    const { t } = useTranslation();
    const confetti = require('../assets/confetti.png');

    const handleEndAssessment = async () => {
        try {
            await completeSession();
            router.navigate('/home');
        } catch (error: any) {
            console.error('Session completion error:', error);
        }
    }

    return (
        <View style = {styles.background}> 
            <Text style = {styles.inputHeader}>
                You will be able to view your results in about an hour through the Past Assessments page on the home screen.
            </Text>

            <Image source = {confetti} style = {{width: 160, height: 160, marginTop: 50}}/>

            {/* 
            removing for now to make sure rhe user has to end the assessment
            <TouchableOpacity
                onPress={() =>
                    router.navigate({
                        pathname: '/educationalresources',
                        params: { returnRoute: '/assesscomplete' },
                    })
                }
                style={styles.blueExtraButton}
            >
                <Text style={styles.btnText}>{t('layout.additionalInformation')}</Text>
            </TouchableOpacity> */}

            <TouchableOpacity onPress = {handleEndAssessment} style = {[styles.blueNextButton, {bottom: 60}]}>
                <Text style = {[styles.btnText]}>End Assessment</Text>
            </TouchableOpacity>
        </View>
        
    )
}

export default AssessComplete;