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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTranslation } from 'react-i18next';
import AntDesign from '@expo/vector-icons/AntDesign';

const SignUp = () => {
    const { t, i18n } = useTranslation();
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
            Alert.alert('Success', t('signup.successAlert'));
            //routing back to login page for now
            router.push('/login');
        } catch (error: any) {
            console.error('Sign-up error:', error);
            Alert.alert(t('signup.errorAlert'), error.message);
        }
    };

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    return (
         <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: '#F6F8FA' }}
            contentContainerStyle={[styles.background, styles.keyboardScroll]}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
        >
            <View style={{ width: "100%", marginBottom: 8 }}>
                <Text style={styles.inputHeader}>{t('signup.email')}</Text>
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
                <Text style={styles.inputHeader}>{t('signup.participantID')}</Text>
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
                <Text style={styles.inputHeader}>{t('signup.password')}</Text>
                <View style={[styles.passwordContainer, { backgroundColor: "white" }]}>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="********"
                        placeholderTextColor="#6B7280"
                        secureTextEntry={!passwordVisible}
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                      <AntDesign
                        name={passwordVisible ? 'eye' : 'eye-invisible'}
                        size={20}
                        color="#ACB5BB"
                      />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ width: "100%", marginBottom: 8 }}>
                <Text style={styles.inputHeader}>{t('signup.confirmPassword')}</Text>
                <View style={[styles.passwordContainer, { backgroundColor: "white" }]}>
                    <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="********"
                        placeholderTextColor="#6B7280"
                        secureTextEntry={!confirmPasswordVisible}
                    />
                    <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.eyeIcon}>
                      <AntDesign
                        name={confirmPasswordVisible ? 'eye' : 'eye-invisible'}
                        size={20}
                        color="#ACB5BB"
                      />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style = {[styles.blueNextButton]} onPress={handleSignUp}>
                <Text style = {[styles.btnText]}>{t('signup.next')}</Text>
            </TouchableOpacity>
        </KeyboardAwareScrollView>
    )
}

export default SignUp;