import React, { useState } from 'react';
import { styles } from '../styles/styles';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import { signUp } from '../utils/gcipAuth';

const SignUp = () => {
    const [email, setEmail] = useState('');
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
            Alert.alert('Success', 'Account created successfully');
            //routing back to login page for now
            router.push('/login');
        } catch (error: any) {
            console.error('Sign-up error:', error);
            Alert.alert('Error', error.message);
        }
    };

    //const [passwordVisible, setPasswordVisible] = useState(false);

    // const togglePasswordVisibility = () => 
    // {
    //     setPasswordVisible(!passwordVisible);
    // };

      return (
    <View style={styleSU.background}> 
      <View style={[{ width: '100%', marginBottom: 8 }]}>
        <Text style={styleSU.inputHeader}>Email</Text>
        <TextInput
          style={[styles.input, { backgroundColor: 'white' }]}
          placeholder="email@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={[{ width: '100%', marginBottom: 8 }]}>
        <Text style={styleSU.inputHeader}>Password</Text>
        <TextInput
          style={[styles.input, { backgroundColor: 'white' }]}
          placeholder="********"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={[{ width: '100%', marginBottom: 8 }]}>
        <Text style={styleSU.inputHeader}>Confirm Password</Text>
        <TextInput
          style={[styles.input, { backgroundColor: 'white' }]}
          placeholder="********"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <TouchableOpacity style={[styles.btn, { marginTop: 16 }]} onPress={handleSignUp}>
        <Text style={styles.btnText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUp;

const styleSU = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F6F8FA',
  },
  inputHeader: {
    left: '2%',
    fontSize: 15,
    color: '#6C7278',
    marginBottom: 8,
  },
});