import React, {useState} from 'react';
import { styles } from '../styles/styles';
import {   
    Alert,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import Logout from './Logout';

const Home = () =>
{

    const router = useRouter()

    const handleResume = () => 
    {
        //const [resumeRoute, setRoute] = useState('');
        //Need some sort of logic here to grab prev data and ascertain where to send user

        Alert.alert(
                "Feature Not Yet Functional",
                "Resuming assessments has not been implemented.",
                  [
                    {
                      text: "OK",
                      style: "cancel"
                    },
                  ],
                { cancelable: true }
              );

        //router.navigate(resumeRoute)
    }

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

            {/*TO TEST PDF GEN*/}
            <TouchableOpacity onPress = {() => {router.navigate('/shortcut')}} style = {[styles.blueNextButton, {top: '60%'}]}>
                <Text style = {[styles.btnText]}>Shortcuts</Text>
            </TouchableOpacity>

            <Logout/>

        </View>
    )
}

export default Home;