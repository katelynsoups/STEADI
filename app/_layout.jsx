import { StyleSheet, View, Text, Platform, TouchableOpacity} from 'react-native'
import React from 'react'
import { Stack, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import Ionicons from "@expo/vector-icons/Ionicons"
import { styles } from '../src/styles/styles'
import { useTranslation } from 'react-i18next'
import '../i18next/i18next.ts';

const RootLayout = () => 
{ 
  const { t, i18n } = useTranslation();

  //Custom header, Stack from expo-router does NOT allow you to asjust many things about it. 
  //BUG: White flash when back button is pressed
  const CustomHeader = ({ headerText }) => (
    <View style={styles.layoutHeader}>

      <TouchableOpacity>
        <Ionicons name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back-sharp'}
          style = {styles.backBtn}
          onPress = {() => router.back()}
        />
      </TouchableOpacity>
      <Text style={styles.headerText}>{headerText}</Text>
    </View>
  );

  const HomeHeader = ({ welcomeText, dateText }) => (
    <View style={styles.layoutHeader}>
      <Text style={[styles.headerText, {top: 75, fontSize: 25, textAlign: 'center', position: 'relative'}]}>{welcomeText}</Text>
      <Text style={[styles.headerText, {top: 100, textAlign: 'center', position: 'relative'}]}>{dateText}</Text>
    </View>
  );

  return (
    <>
      <StatusBar style = "light" />

      <Stack>
        <Stack.Screen name = "index" options = {{headerShown: false}}/>

        <Stack.Screen name = "shortcut" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.shortcut")}/>
        }}/>

        <Stack.Screen name = "pdfgen" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.pdfGen")}/>
        }}/>

        <Stack.Screen name = "login" options = {{headerShown: false}}/>

        <Stack.Screen name = "home" options = {{
          header: () => 
            <HomeHeader welcomeText = {t("layout.home")}/>
        }}/>

        <Stack.Screen name = "pastassessments" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.pastAssessments")}/>
        }}/>

        <Stack.Screen name = "signup" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.signup")}/>
        }}/>

        <Stack.Screen name = "screening" options = {{
            header: () =>
                <CustomHeader headerText = {t("layout.screening")}/>
        }}/>

        <Stack.Screen name = "screening2" options = {{
            header: () =>
                <CustomHeader headerText = {t("layout.screening")}/>
        }}/>

        <Stack.Screen name = "screening3" options = {{
            header: () =>
                <CustomHeader headerText = {t("layout.screening")}/>
        }}/>

        <Stack.Screen name = "screening4" options = {{
            header: () =>
                <CustomHeader headerText = {t("layout.screening")}/>
        }}/>

        <Stack.Screen name = "screening5" options = {{
            header: () =>
                <CustomHeader headerText = {t("layout.screening")}/>
        }}/>

        <Stack.Screen name = "screening6" options = {{
            header: () =>
                <CustomHeader headerText = {t("layout.screening")}/>
        }}/>

        <Stack.Screen name = "screeningresult" options = {{ headerShown: false }}/>

        <Stack.Screen name = "bloodtest" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.bloodTest")}/>
        }}/>

        <Stack.Screen name = "visionupload" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.visionUpload")}/>
        }}/>

        <Stack.Screen name = "walkingupload" options = {{
          header: () =>
            <CustomHeader headerText = {t("layout.walkingUpload")}/>
        }}/>

        <Stack.Screen name = "success" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.success")}/>
        }}/>

        <Stack.Screen name = "homehazards" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.homeHazards")}/>
        }}/>

        <Stack.Screen name = "homehazards2" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.homeHazards")}/>
        }}/>

        <Stack.Screen name = "foottestinstruct" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.footTestInstruct")}/>
        }}/>

        <Stack.Screen name = "foottest" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.footTest")}/>
        }}/>

        <Stack.Screen name = "vitamindtestinstruct" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.vitaminDTestInstruct")}/>
        }}/>

        <Stack.Screen name = "vitamindtest" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.vitaminDTest")}/>
        }}/>

        <Stack.Screen name = "medicationupload" options = {{
          header: () =>
            <CustomHeader headerText = {t("layout.medicationUpload")}/>
        }}/>

        <Stack.Screen name = "medicationresults" options = {{
          header: () =>
            <CustomHeader headerText = {t("layout.medicationResults")}/>
        }}/>

        <Stack.Screen name = "medicationtypedupload" options = {{
          header: () =>
            <CustomHeader headerText = {t("layout.medicationTypedUpload")}/>
        }}/>

        <Stack.Screen name = "moodquestions" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.moodQuestions")}/>
        }}/>

      </Stack>
    </>
  )
}

export default RootLayout