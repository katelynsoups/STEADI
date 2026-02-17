import React, { useState } from 'react';
import { styles } from '../styles/styles';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { createDeIDUser, signUp } from '../utils/gcipAuth';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [participantID, setparticipantID] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    const handleSignUp = async () => {
        console.log("Sign-up button pressed");
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            //currently the only info being stored in GCIP is email and password (no names)
            const userCredential = await signUp(email, password);
            console.log('User created:', userCredential.user);
            //create second user in table with participantID and userCredential.user.uid----------------------------------
            const pid = await createDeIDUser(participantID); 
            console.log('Deidentified Log:', pid);
            Alert.alert('Success', 'Account created successfully');
            //routing back to login page for now
            router.push('/login');
        } catch (error: any) {
            console.error('Sign-up error:', error);
            Alert.alert('Error', error.message);
        }
    };

    const [passwordVisible, setPasswordVisible] = useState(false);

    // const togglePasswordVisibility = () => 
    // {
    //     setPasswordVisible(!passwordVisible);
    // };

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
            <View style={{ width: "100%", marginBottom: 8 }}>
                <Text style={styles.inputHeader}>Email</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: "white" }]}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="email@example.com"
                    placeholderTextColor="#6B7280"
                    keyboardType="email-address"
                />
            </View>
            <View style={{ width: "100%", marginBottom: 8 }}>
                <Text style={styles.inputHeader}>Participant ID</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: "white" }]}
                    value={participantID}
                    onChangeText={setparticipantID}
                    placeholder="11111111"
                    placeholderTextColor="#6B7280"
                    keyboardType="number-pad"
                />
            </View>
            <View style={{ width: "100%", marginBottom: 8 }}>
                <Text style={styles.inputHeader}>Password</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: "white" }]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="********"
                    placeholderTextColor="#6B7280"
                    secureTextEntry={!passwordVisible}
                />
            </View>
            <View style={{ width: "100%", marginBottom: 8 }}>
                <Text style={styles.inputHeader}>Confirm Password</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: "white" }]}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="********"
                    placeholderTextColor="#6B7280"
                    secureTextEntry={!passwordVisible}
                />
            </View>

            <TouchableOpacity style = {[styles.btn, {position: "static", marginTop: 16}]} onPress={handleSignUp}>
                <Text style = {[styles.btnText]}>Next</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SignUp;