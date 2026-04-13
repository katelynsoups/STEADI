import React, {useState, useEffect} from 'react';
import { styles } from '../styles/styles';
import {   
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import Logout from './Logout';
import {getCompletedAssessments, Assessment} from '../utils/getData';

const PastAssessments = () =>
{
    const router = useRouter();

    const [assessments, setAssessments] = useState<Assessment[]>([])
    const [ready, setReady] = useState(false)
    const [isEmpty, setEmpty] = useState(true)

    useEffect(() => 
    {
        getCompletedAssessments().then(userAssessments =>
        {
            setAssessments(userAssessments)
            if(userAssessments.length != 0)
                setEmpty(false)
            setReady(true);
        })

    }, []);
    
    return (
        <View style = {styles.background}> 

            {!ready && (
                <View style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 16,
                        padding: 32,
                        alignItems: 'center',
                        width: '75%',
                        marginBottom: 270
                    }}>
                        <ActivityIndicator size="large" color="#2196F3" />
                        <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 16 }}>
                            Grabbing Assessments
                        </Text>
                        <Text style={{ color: '#666', marginTop: 8, textAlign: 'center' }}>
                            Please keep the app open while we find your assessments.
                        </Text>
                    </View>
                </View>
            )}

            {ready && !isEmpty &&
                assessments.map(doc => 
                {return(
                    <TouchableOpacity 
                        style = {[styles.blueNextButton, {position: "static", width: "80%", marginBottom: 16}]} 
                        onPress = {() => router.navigate({pathname: "/pdfgen", params: {id: `${doc.id as string}`, date: `${doc.date as string}`}})}
                        key = {doc.sessionNumber}>
                        <Text style = {styles.btnText}>{doc.date}</Text>
                    </TouchableOpacity>
                )})
            }
            {ready && isEmpty &&
                <Text style = {styles.inputHeader}>No Asssessments Found!</Text>
            }
            {ready && isEmpty &&
                <Text style = {styles.inputHeader}>If you just finished an assessment, we might still be processing your information. Please come back in approximately an hour.</Text>
            }
            <Logout/>

        </View>
        
    )
}

export default PastAssessments;