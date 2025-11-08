import React, { useState } from 'react';
import { styles } from '../styles/styles';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

const SignUp = () =>
{
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => 
    {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <View style = {styles.background}> 
            <View style = {[{width: "100%"}, {marginBottom: 8}]}><Text style = {styles.inputHeader}>First Name</Text>
                <TextInput
                    style={[styles.input, {backgroundColor: "white"}]}
                />
            </View>
            <View style = {[{width: "100%"}, {marginBottom: 8}]}><Text style = {styles.inputHeader}>Last Name</Text>
                <TextInput
                    style={[styles.input, {backgroundColor: "white"}]}
                />
            </View>
            <View style = {[{width: "100%"}, {marginBottom: 8}]}><Text style = {styles.inputHeader}>Phone Number</Text>
                <TextInput
                    style={[styles.input, {backgroundColor: "white"}]}
                    placeholder="(888) 888-8888"
                    placeholderTextColor="#6B7280"
                    keyboardType="phone-pad"
                />
            </View>
            <View style = {[{width: "100%"}, {marginBottom: 8}]}><Text style = {styles.inputHeader}>New Password</Text>
                <TextInput
                    style={[styles.input, {backgroundColor: "white"}]}
                    placeholder="********"
                    placeholderTextColor="#6B7280"
                    secureTextEntry={!passwordVisible}
                />
            </View>
               <View style = {[{width: "100%"}, {marginBottom: 8}]}><Text style = {styles.inputHeader}>Confirm Password</Text>
                <TextInput
                    style={[styles.input, {backgroundColor: "white"}]}
                    placeholder="********"
                    placeholderTextColor="#6B7280"
                    secureTextEntry={!passwordVisible}
                />
            </View>

            <TouchableOpacity style = {[styles.btn, {position: "static", marginTop: 16}]}>
                <Text style = {[styles.btnText]}>Next</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SignUp;