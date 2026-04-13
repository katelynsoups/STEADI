import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  Image
} from 'react-native';
import { styles } from '../styles/styles';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { signIn } from '../utils/gcipAuth';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/gcipAuth';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import '../../i18next/i18next';
import LanguageSelector from '../components/LanguageSelector';

const Login: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  const Shield = require('../assets/Shield.png');
  const router = useRouter();

  const { t, i18n } = useTranslation();

  const handleLogin = async () => {
    try {
      const userCredential = await signIn(emailOrPhone, password);
      const { user } = userCredential;
      const docRef = doc(db, "Users-AppData", user.uid);
      const docSnap = await getDoc(docRef);
      const isFirstLogin = docSnap.data()?.firstLogin === true;

      if (isFirstLogin) {
        await updateDoc(docRef, { firstLogin: false });
        router.push('/screening');
      } else {
        router.push('/home');
      }
    } catch (err: any) {
      Alert.alert(t('login.alert'), err.response?.data?.error?.message || err.message);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  //tell react when to rerender for language switch
  const [isChangingLang, setIsChangingLang] = useState(false);

  const handleLanguageToggle = useCallback(async () => {
    if (isChangingLang) return; // prevent double-tap
    setIsChangingLang(true);
    try {
      const nextLang = i18n.language.startsWith('en') ? 'es' : 'en';
      await i18n.changeLanguage(nextLang);
    } finally {
      setIsChangingLang(false);
    }
  }, [i18n.language, isChangingLang]);

  return (
    <SafeAreaProvider>
      <View style={styles.loginRoot}>
        <StatusBar barStyle="light-content" backgroundColor="#B14B02" />
        <SafeAreaView style={styles.loginSafeArea} edges={['top', 'left', 'right']}>
          <KeyboardAwareScrollView
            style={styles.loginKeyboardScroll}
            contentContainerStyle={styles.loginScrollContent}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.loginBody}>
              <View style={styles.header}>
                <Image source={Shield} style={{ width: 70, height: 70, alignSelf: 'center', marginTop: 16 }} />
                <Text style={styles.headerTitle}>{t('login.title')}</Text>
                <Text style={styles.headerSubtitle}>
                  {t('login.subtitle')}
                </Text>
              </View>

              <View style={styles.outerContainer}>
                <View style={styles.container}>
                  <View style={styles.formContainer}>
                {/*
                {/* Apple Button }
                <TouchableOpacity style={styles.appleButton}>
                  <AntDesign name="apple" size={24} color="black" />
                  <Text style={styles.appleButtonText}>{t('login.appleButton')}</Text>
                </TouchableOpacity>

                {/* Divider }
                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>{t('login.or')}</Text>
                  <View style={styles.dividerLine} />
                </View>
                */}

                {/* Form Inputs */}
                <View style={styles.form}>
                  <TextInput
                    style={[styles.input, { marginBottom: 20 }]}
                    placeholder={t('login.emailPlaceholder')}
                    placeholderTextColor="#6B7280"
                    keyboardType="email-address"
                    value={emailOrPhone}
                    onChangeText={setEmailOrPhone}
                  />

                  <View style={[styles.passwordContainer, { marginBottom: 20 }]}>
                    <TextInput
                      style={styles.input}
                      placeholder={t('login.passwordPlaceholder')}
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
                  <View style={[styles.optionsContainer, { marginBottom: 20 }]}>
                    <TouchableOpacity
                      style={styles.rememberMeContainer}
                      onPress={() => setRememberMe(!rememberMe)}
                    >
                      <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]} />
                      <Text style={styles.rememberMeText}>{t('login.rememberMe')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Text style={styles.forgotPasswordText}>{t('login.forgotPassword')}</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Login Button */}
                  <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.blueButtonText}>{t('login.login')}</Text>
                  </TouchableOpacity>
                </View>

                {/* Sign Up Link */}
                <View style={styles.signupContainer}>
                  <Text style={styles.signupText}>{t('login.noAccount')}</Text>
                  <TouchableOpacity onPress={() => router.push('/signup')}>
                    <Text style={styles.signupLink}>{t('login.signUp')}</Text>
                  </TouchableOpacity>
                </View>

                {/* Language Icon */}
                <View style={styles.globeContainer}>
                  <LanguageSelector />
                </View>
                  </View>
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
};

export default Login;