import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { styles } from '../src/styles/styles';
import ScreeningResult from '../src/components/ScreeningResult';

// we use these constants so that the same component can be used for two different results screens
// at risk text
const AT_RISK_HEADER = 'Your screening results are associated with a higher risk of falling.';
const AT_RISK_BODY =
  'Next, you will be completing an assessment to measure your modifiable fall risk factors.Once completed, you will receive a printable summary of your Fall Risk Factors.The assessment will take approximately 60 minutes and requires use of your at-home kit.';

// not at risk text
const NOT_AT_RISK_HEADER = 'Your screening results are associated with a lower risk of falling.';
const NOT_AT_RISK_BODY =
  'You are not currently at a high risk for falling. It is still important to stay aware and imformed in order to prevent falls. You have the option to complete the assesmnet of modifiable risk factors, or you may select to return to your home profile and view prevention resources from the CDC.';

const ScreeningResultPage = () => {
  const router = useRouter();
  const { atRisk } = useLocalSearchParams();
  const isAtRisk = atRisk === 'true';

  const headerText = isAtRisk ? AT_RISK_HEADER : NOT_AT_RISK_HEADER;
  const bodyText = isAtRisk ? AT_RISK_BODY : NOT_AT_RISK_BODY;

  return (
    <View style={[styles.safeArea, { flex: 1 }]}>
      <View style={styles.layoutHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back-sharp'}
            style={styles.backBtn}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>{headerText}</Text>
      </View>
      <View style={{ flex: 1, backgroundColor: '#F6F8FA' }}>
        <ScreeningResult bodyText={bodyText} />
        {isAtRisk && (
          <TouchableOpacity
            style={styles.blueNextButton}
            activeOpacity={0.9}
            onPress={() => router.push('/vitamindtestinstruct')}
          >
            <Text style={styles.blueButtonText}>Start Assessment</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ScreeningResultPage;
