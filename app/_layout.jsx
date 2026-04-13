import { StyleSheet, View, Text, Platform, TouchableOpacity} from 'react-native'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import Ionicons from "@expo/vector-icons/Ionicons"
import { styles } from '../src/styles/styles'
import { useTranslation } from 'react-i18next'
import React, { useState, useEffect } from 'react'
import { i18nInitPromise } from '../i18next/i18next';
import LanguageSelector from '../src/components/LanguageSelector';

//Custom header, Stack from expo-router does NOT allow you to asjust many things about it. 
//BUG: White flash when back button is pressed
const CustomHeader = ({ headerText, route, showHome = true, langRight = 75}) => (
  <View style={styles.layoutHeader}>

    <TouchableOpacity>
      <Ionicons name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back-sharp'}
        style = {styles.backBtn}
        onPress = {() => router.replace(route)}
      />
    </TouchableOpacity>

    <Text style={styles.headerText}>{headerText}</Text>
    
    <View style={{ position: 'absolute', right: langRight, bottom: 100 }}>
      <LanguageSelector 
        triggerStyle={{ borderColor: '#fff' }}
        triggerTextStyle={{ color: '#fff' }}
      />
    </View>
    {showHome && (
      <View style={{ position: 'absolute', right: 16, bottom: 100 }}>
        <TouchableOpacity>
          <Ionicons name={"home-outline"}
            style = {{color: 'white', fontSize: 30}}
            onPress = {() => router.navigate('/home')}
          />
        </TouchableOpacity>
      </View>
    )}
  </View>
);

const EducationalResourcesHeader = () => {
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const back =
    typeof params.returnRoute === 'string' && params.returnRoute.length > 0
      ? params.returnRoute
      : '/home';
  return (
    <CustomHeader
      headerText={t('layout.educationalResources')}
      route={back}
    />
  );
};

const HomeHeader = ({ welcomeText, dateText }) => (
  <View style={styles.layoutHeader}>
    <Text style={[styles.headerText, {top: 75, fontSize: 35, textAlign: 'center', position: 'relative'}]}>{welcomeText}</Text>
    <Text style={[styles.headerText, {top: 100, textAlign: 'center', position: 'relative'}]}>{dateText}</Text>
        <View style={{ position: 'absolute', right: 16, bottom: 90 }}>
      <LanguageSelector 
        triggerStyle={{ borderColor: '#fff' }}
        triggerTextStyle={{ color: '#fff' }}
      />
    </View>
  </View>
  
);

const RootLayout = () => 
{ 
  const { t, i18n } = useTranslation();
    const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    i18nInitPromise.then(() => setI18nReady(true));
  }, []);

  if (!i18nReady) return null;

  return (
    <>
      <StatusBar style = "light" />

      <Stack>
        <Stack.Screen name = "index" options = {{headerShown: false}}/>

        <Stack.Screen name = "shortcut" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.shortcut")} route = {"/home"}/>
        }}/>

        <Stack.Screen name = "pdfgen" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.pdfGen")} route = {"/pastassessments"}/>
        }}/>

        <Stack.Screen name = "educationalresources" options = {{
          header: () => <EducationalResourcesHeader />
        }}/>

        <Stack.Screen name = "login" options = {{headerShown: false}}/>

        <Stack.Screen name = "home" options = {{
          header: () => 
            <HomeHeader welcomeText = {t("layout.home")}/>
        }}/>

        <Stack.Screen name = "pastassessments" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.pastAssessments")} route = {"/home"}/>
        }}/>

        <Stack.Screen name = "signup" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.signup")} showHome={false} langRight={16} route = {"/login"}/>
        }}/>

        <Stack.Screen name = "screening" options = {{
            header: () =>
                <CustomHeader headerText = {t("layout.screening")} route = {"/home"}/>
        }}/>

        <Stack.Screen name = "screening2" options = {{
            header: () =>
                <CustomHeader headerText = {t("layout.screening")} route = {"/screening"}/>
        }}/>

        <Stack.Screen name = "screening3" options = {{
            header: () =>
                <CustomHeader headerText = {t("layout.screening")} route = {"/screening2"}/>
        }}/>

        <Stack.Screen name = "screening4" options = {{
            header: () =>
                <CustomHeader headerText = {t("layout.screening")} route = {"/screening3"}/>
        }}/>

        <Stack.Screen name = "screening5" options = {{
            header: () =>
                <CustomHeader headerText = {t("layout.screening")} route = {"/screening4"}/>
        }}/>

        <Stack.Screen name = "screening6" options = {{
            header: () =>
                <CustomHeader headerText = {t("layout.screening")} route = {"/screening5"}/>
        }}/>

        <Stack.Screen name = "screeningresult" options = {{ headerShown: false }}/>

        <Stack.Screen name = "bloodtest" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.bloodTest")} route = {"/vitamindtestinstruct"}/>
        }}/>

        <Stack.Screen name = "visionupload" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.visionUpload")} route = {"/medicationupload"}/>
        }}/>

        <Stack.Screen name = "success" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.success")} route = {"/visiontestright"}/>
        }}/>

        <Stack.Screen name = "walkingupload" options = {{
          header: () =>
            <CustomHeader headerText = {t("layout.walkingUpload")} route = {"/success"}/>
        }}/>

        <Stack.Screen name = "walkingsuccess" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.success")} route = {"/walkingupload"}/>
        }}/>

        <Stack.Screen name = "homehazards" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.homeHazards")} route = {"/walkingsuccess"}/>
        }}/>

        <Stack.Screen name = "homehazards2" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.homeHazards")} route = {"/homehazards"}/>
        }}/>

        <Stack.Screen name = "foottestinstruct" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.footTestInstruct")} route = {"/homehazards2"}/>
        }}/>

        <Stack.Screen name = "foottest" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.footTest")} route = {"/foottestinstruct"}/>
        }}/>

        <Stack.Screen name = "vitamindtestinstruct" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.vitaminDTestInstruct")} route = {"/home"}/>
        }}/>

        <Stack.Screen name = "vitamindtest" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.vitaminDTest")} route = {"/moodquestions"}/>
        }}/>

        <Stack.Screen name = "medicationupload" options = {{
          header: () =>
            <CustomHeader headerText = {t("layout.medicationUpload")} route = {"/bloodtest"}/>
        }}/>

        <Stack.Screen name = "medicationresults" options = {{
          header: () =>
            <CustomHeader headerText = {t("layout.medicationResults")} route = {"/medicationupload"}/>
        }}/>

        <Stack.Screen name = "medicationtypedupload" options = {{
          header: () =>
            <CustomHeader headerText = {t("layout.medicationTypedUpload")} route = {"/medicationupload"}/>
        }}/>

        <Stack.Screen name = "moodquestions" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.moodQuestions")} route = {"/foottest"}/>
        }}/>

        <Stack.Screen name = "assesscomplete" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.assessComplete")} route = {"/vitamindtest"}/>
        }}/>

        <Stack.Screen name = "visioninstruction" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.visionInstruction")} route = {"/medicationupload"}/>
        }}/>

        <Stack.Screen name = "visiontestleft" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.visionTestLeft")} route = {"/visioninstruction"}/>
        }}/>

        <Stack.Screen name = "visiontestright" options = {{
          header: () => 
            <CustomHeader headerText = {t("layout.visionTestRight")} route = {"/visiontestleft"}/>
        }}/>

      </Stack>
    </>
  )
}

export default RootLayout