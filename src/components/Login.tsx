import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { styles } from '../styles/styles';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';

const Login: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        {/* Header Section */}
        <View style={styles.header}>
            {/* TODO: Insert logo here */}
            <Text style={styles.headerTitle}>Sign in to your Account</Text>
            <Text style={styles.headerSubtitle}>Enter your phone number and password to log in</Text>
        </View>

        <View style={styles.outerContainer}>
            <View style={styles.container}>
                {/* Form Section */}
                <View style={styles.formContainer}>
                    <TouchableOpacity style={styles.appleButton}>
                        <AntDesign name="apple" size={24} color="black" />
                        <Text style={styles.appleButtonText}>Continue with Apple</Text>
                    </TouchableOpacity>

                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>Or</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <View style={styles.form}>
                        <TextInput
                            style={[styles.input, { marginBottom: 16 }]}
                            placeholder="(888) 888-8888"
                            placeholderTextColor="#6B7280"
                            keyboardType="phone-pad"
                        />
                        <View style={[styles.passwordContainer, { marginBottom: 16 }]}>
                            <TextInput
                                style={styles.input}
                                placeholder="********"
                                placeholderTextColor="#6B7280"
                                secureTextEntry={!passwordVisible}
                            />
                            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                                <AntDesign name="eye-invisible" size={20} color="#ACB5BB" /> {/* TODO: Move this color here to style sheet as 'Secondary Gray'*/}
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.optionsContainer, { marginBottom: 16 }]}>                            <TouchableOpacity style={styles.rememberMeContainer} onPress={() => setRememberMe(!rememberMe)}>
                                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]} />
                                <Text style={styles.rememberMeText}>Remember me</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.loginButton}>
                            <Text style={styles.loginButtonText}>Log In</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.signupContainer}>
                      <Text style={styles.signupText}>Don't have an account? </Text>
                      <TouchableOpacity>
                        <Text style={styles.signupLink}>Sign Up</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.globeContainer}>
                        <Entypo name="language" size={24} color="#ACB5BB" />
                    </View>
                </View>
            </View>
        </View>
    </SafeAreaView>
  );
};

export default Login;
