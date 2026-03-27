import { StyleSheet, View, Text, Platform, TouchableOpacity} from 'react-native'
import React from 'react'
import { Stack, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import Ionicons from "@expo/vector-icons/Ionicons"
import { styles } from '../src/styles/styles'

const RootLayout = () => 
{ 
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
            <CustomHeader headerText = "Temporary shortcut menu"/>
        }}/>

        <Stack.Screen name = "login" options = {{headerShown: false}}/>

        <Stack.Screen name = "home" options = {{
          header: () => 
            <HomeHeader welcomeText = {`Welcome back!`}  dateText = {'Its been # months since your last assessment.'}/>
        }}/>

        <Stack.Screen name = "pastassessments" options = {{
          header: () => 
            <CustomHeader headerText = "Past Assessments"/>
        }}/>

        <Stack.Screen name = "signup" options = {{
          header: () => 
            <CustomHeader headerText = "Please create an account using the participant ID provided by the research team:"/>
        }}/>

        <Stack.Screen name = "screening" options = {{
            header: () =>
                <CustomHeader headerText = "Check your risk of falling by answering the following questions:"/>
        }}/>

        <Stack.Screen name = "screening2" options = {{
            header: () =>
                <CustomHeader headerText = "Check your risk of falling by answering the following questions:"/>
        }}/>

        <Stack.Screen name = "screening3" options = {{
            header: () =>
                <CustomHeader headerText = "Check your risk of falling by answering the following questions:"/>
        }}/>

        <Stack.Screen name = "screening4" options = {{
            header: () =>
                <CustomHeader headerText = "Check your risk of falling by answering the following questions:"/>
        }}/>

        <Stack.Screen name = "screening5" options = {{
            header: () =>
                <CustomHeader headerText = "Check your risk of falling by answering the following questions:"/>
        }}/>

        <Stack.Screen name = "screening6" options = {{
            header: () =>
                <CustomHeader headerText = "Check your risk of falling by answering the following questions:"/>
        }}/>

        <Stack.Screen name = "screeningresult" options = {{ headerShown: false }}/>

        <Stack.Screen name = "bloodtest" options = {{
          header: () => 
            <CustomHeader headerText = "Measure your orthostatic blood pressure."/>
        }}/>

        <Stack.Screen name = "visionupload" options = {{
          header: () => 
            <CustomHeader headerText = "Complete the vision assessment while recording."/>
        }}/>

        <Stack.Screen name = "walkingupload" options = {{
          header: () =>
            <CustomHeader headerText = "Complete the walking assessment while recording."/>
        }}/>

        <Stack.Screen name = "success" options = {{
          header: () => 
            <CustomHeader headerText = "Success!"/>
        }}/>

        <Stack.Screen name = "homehazards" options = {{
          header: () => 
            <CustomHeader headerText = "Please select which of the following elements you have in your home:"/>
        }}/>

        <Stack.Screen name = "homehazards2" options = {{
          header: () => 
            <CustomHeader headerText = "Please select which of the following elements you have in your home:"/>
        }}/>

        <Stack.Screen name = "foottestinstruct" options = {{
          header: () => 
            <CustomHeader headerText = "How to use a monofilament to test for foot neuropathy:"/>
        }}/>

        <Stack.Screen name = "foottest" options = {{
          header: () => 
            <CustomHeader headerText = "Perform the monofilament foot test."/>
        }}/>

        <Stack.Screen name = "vitamindtestinstruct" options = {{
          header: () => 
            <CustomHeader headerText = "Vitamin D Assesment"/>
        }}/>

        <Stack.Screen name = "vitamindtest" options = {{
          header: () => 
            <CustomHeader headerText = "Record vitamin D assesment results."/>
        }}/>

        <Stack.Screen name = "medicationupload" options = {{
          header: () =>
            <CustomHeader headerText = "Next, we want to assess your medications to determine how they might influence fall risk."/>
        }}/>

        <Stack.Screen name = "medicationresults" options = {{
          header: () =>
            <CustomHeader headerText = "Please view the summary of your medication below."/>
        }}/>

        <Stack.Screen name = "medicationtypedupload" options = {{
          header: () =>
            <CustomHeader headerText = "Next, we want to assess your medications to determine how they might influence fall risk."/>
        }}/>

        <Stack.Screen name = "moodquestions" options = {{
          header: () => 
            <CustomHeader headerText = "Answer the following questions:"/>
        }}/>

      </Stack>
    </>
  )
}

export default RootLayout