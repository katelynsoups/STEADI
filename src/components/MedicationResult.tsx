import React, { useEffect, useState, useRef } from 'react';
import { styles } from '../styles/styles';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getDrugSideEffects } from '../utils/medService'
import { enterMedication } from '../utils/dataEntry';

const checkmark = require('../assets/success.png');

interface DrugInfo {
  name: string;
  sideEffects: string[];
  hasFallRisk: boolean;
}

const MedicationResults = () =>
{
    const router = useRouter();
    const { medicationName } = useLocalSearchParams();
    const [drugInfo, setDrugInfo] = useState<DrugInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const medicationMap = useRef(new Map<string, boolean>()).current; //modling after home hazards
    
    const handleMedication = async () => {
        try{
            await enterMedication(medicationMap);
            //router.navigate(next);
        } catch (error: any) {
            console.error('Database entry error:', error);
        }
    };

    const hasMedication = medicationName && medicationName !== '';

    useEffect(() => {
        if (hasMedication && typeof medicationName === 'string') {
            fetchDrugInfo(medicationName);
        }
    }, [medicationName]);

    //once drung info loads we will add med name and fall risk to database
    useEffect(() => {
        if (drugInfo && typeof medicationName === 'string') {
            medicationMap.set(medicationName, drugInfo.hasFallRisk ?? false);
            handleMedication();
        }
    }, [drugInfo]);

    const fetchDrugInfo = async (medName: string) => {
        setLoading(true);
        const info = await getDrugSideEffects(medName);
        setDrugInfo(info);
        setLoading(false);
    };

    const successStyle = StyleSheet.create({
        title: {
            fontWeight: 'bold', 
            fontSize: 25, 
            textAlign: 'center', 
            lineHeight: 40,
            marginBottom: 20
        },
        sectiontext: {
            fontSize: 18,
            marginTop: 20,
            marginBottom: 10,
        }
    });

    return (
        //if we were able to detect medication text:
        <View style = {styles.background}> 
            {hasMedication ? (
            <>
                <Text style = {[successStyle.title]}>
                    Medication detected: {medicationName}
                </Text>
                <Image source = {checkmark} style = {{width: 150, height: 150}}/>

                {loading && (
                        <ActivityIndicator size="large" color="#172063" style={{marginTop: 20}} />
                    )}
                    
                    {!loading && drugInfo && (
                        <View style={{ marginTop: 20}}>
                            {drugInfo.hasFallRisk ? (
                                <>
                                    <Text style = {[successStyle.sectiontext]}>⚠️ Fall Risk Alert: This medication has known adverse effects or warnings associated with an increased fall risk.</Text>
                                </>
                            ) : (
                                <Text style={[successStyle.sectiontext, {color: 'green'}]}>
                                    ✓ No fall-risk related side effects were detected for this medication.
                                </Text>
                            )}
                        </View>
                    )}
                    
                    {!loading && !drugInfo && (
                        <Text style={{textAlign: 'center', marginTop: 20, paddingHorizontal: 20}}>
                            Side effect information not available for this medication.
                        </Text>
                    )}
                
                <TouchableOpacity
                    onPress={() => router.navigate('/medicationupload')}
                    style = {styles.blueExtraButton}>
                    <Text style = {styles.btnText}>Upload Another Medication</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    onPress = {() => { router.navigate('/visionupload')}} 
                    style = {styles.blueNextButton}>
                    <Text style = {[styles.btnText]}>Next</Text>
                </TouchableOpacity>
            </>
        ) : (
            <>
                <Text style = {[styles.inputHeader, successStyle.sectiontext]}>
                    We were not able to detect your medication label. Please try to upload again, or manually enter medication name.
                </Text>
                
                <TouchableOpacity 
                    onPress = {() => { router.navigate('/medicationtypedupload')}} 
                    style = {styles.blueExtraButton}>
                    <Text style = {[styles.btnText]}>Manually Enter Medication</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress = {() => { router.navigate('/medicationupload')}} 
                    style = {styles.greySkipButton}>
                    <Text style = {[styles.greySkipButtonText]}>Try Image Upload Again</Text>
                </TouchableOpacity>
            </>
        )}
        </View>
    )
}

export default MedicationResults;