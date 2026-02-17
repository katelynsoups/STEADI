import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { styles } from '../styles/styles';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { signIn } from '../utils/gcipAuth';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { getSaveStatus } from '../utils/saveUnit';

const Login: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleLogin = async () => {
    try {
      const userCredential = await signIn(emailOrPhone, password);
      const token = await userCredential.user.getIdToken();
      Alert.alert('Success', 'Logged in successfully!');
      router.push(await getSaveStatus());
    } catch (err: any) {
      Alert.alert('Login Failed', err.response?.data?.error?.message || err.message);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sign in to your Account</Text>
          <Text style={styles.headerSubtitle}>
            Enter your phone number and password to log in
          </Text>
        </View>

        <View style={styles.outerContainer}>
          <View style={styles.container}>
            <View style={styles.formContainer}>
              {/* Apple Button */}
              <TouchableOpacity style={styles.appleButton}>
                <AntDesign name="apple" size={24} color="black" />
                <Text style={styles.appleButtonText}>Continue with Apple</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Form Inputs */}
              <View style={styles.form}>
                <TextInput
                  style={[styles.input, { marginBottom: 16 }]}
                  placeholder="email@example.com"
                  placeholderTextColor="#6B7280"
                  keyboardType="email-address"
                  value={emailOrPhone}
                  onChangeText={setEmailOrPhone}
                />

                <View style={[styles.passwordContainer, { marginBottom: 16 }]}>
                  <TextInput
                    style={styles.input}
                    placeholder="********"
                    placeholderTextColor="#6B7280"
                    secureTextEntry={!passwordVisible}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                    <AntDesign
                      name={passwordVisible ? 'eye' : 'eye-invisible'}
                      size={20}
                      color="#ACB5BB"
                    />
                  </TouchableOpacity>
                </View>

                {/* Options */}
                <View style={[styles.optionsContainer, { marginBottom: 16 }]}>
                  <TouchableOpacity
                    style={styles.rememberMeContainer}
                    onPress={() => setRememberMe(!rememberMe)}
                  >
                    <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]} />
                    <Text style={styles.rememberMeText}>Remember me</Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>

                {/* Login Button */}
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                  <Text style={styles.blueButtonText}>Log In</Text>
                </TouchableOpacity>
              </View>

              {/* Sign Up Link */}
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/signup')}>
                  <Text style={styles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>

              {/* Language Icon */}
              <View style={styles.globeContainer}>
                <Entypo name="language" size={24} color="#ACB5BB" />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Login;