import React, {useState, useEffect} from 'react';
import { styles } from '../styles/styles';
import {   
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import Logout from './Logout';
import {getCompletedAssessments, Assessment} from '../utils/getData';

const router = useRouter()

const PastAssessments = () =>
{

    const [assessments, setAssessments] = useState<Assessment[]>([])
    const [renderable, setRenderable] = useState(false);
    const [ready, isReady] = useState(false);

    useEffect(() => 
    {
        getCompletedAssessments().then(userAssessments =>
        {
            setAssessments(userAssessments)
        })

    }, []);
    
    return (
        <View style = {styles.background}> 

            <Text>WIP!!! Pressing the button here takes you to the old PDFGen page.</Text>

            {
                assessments.map(doc => 
                {return(
                    <TouchableOpacity 
                        style = {[styles.blueNextButton, {position: "static", marginBottom: 16}]} 
                        onPress = {() => router.navigate({pathname: "/pdfgen", params: {id: `${doc.id as string}`}})}
                        key = {doc.sessionNumber}>
                        <Text style = {styles.btnText}>{doc.date}</Text>
                    </TouchableOpacity>
                )})
            }
            <Logout/>

        </View>
        
    )
}

export default PastAssessments;