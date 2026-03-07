import React, {useState} from 'react';
import { styles } from '../styles/styles';
import {   
    View,
    Text,
} from 'react-native';
import Logout from './Logout';

const Home = () =>
{

    return (
        <View style = {styles.background}> 

            <Text style = {styles.inputHeader}>Temporary landing! Need a way to view past assessments in the first place!</Text>
            <Logout/>

        </View>
        
    )
}

export default Home;