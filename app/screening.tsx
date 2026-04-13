import React, { useEffect, useState } from 'react';
import Screening, { FollowUpModalConfig } from '../src/components/Screening';
import { getScreeningQuestionsForStep } from '../src/data/screeningQuestions';
import { updateSaveStatus } from '../src/utils/saveUnit';
import { useTranslation } from 'react-i18next';
import { startNewSession } from '../src/utils/dataEntry';
import { ActivityIndicator, View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const ScreeningPage = (): React.ReactElement => {
  const questions = getScreeningQuestionsForStep(0);
  const { t } = useTranslation();
  const [sessionReady, setSessionReady] = useState(false);
  
  const { param } = useLocalSearchParams();

  useEffect(() => {
      const initSession = async () => {
          if (param == "y")
            await startNewSession();
          
          await updateSaveStatus(`/screening`);
          setSessionReady(true);
      };
        initSession();
  }, []);

  if (!sessionReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16, fontSize: 16 }}>Starting session...</Text>
      </View>
    );
  }

  //changes this file to tsx to allow types for the modal
  const followUpModal: FollowUpModalConfig = {
    questionId: 'fallen',
    triggerAnswer: 'Yes',
    submitLabel: t('screeningFollowUps.submitButton'),
    fields: [
      {
        id: 'fallCount',
        label: t('screeningFollowUps.fallCount'),
        placeholder: '0',
        type: 'number',
      },
      {
        id: 'injured',
        label: t('screeningFollowUps.injuryAssessment'),
        type: 'select',
        options: [t('screeningFollowUps.injuryOptions.yes'), t('screeningFollowUps.injuryOptions.no')],
      },
    ],
    onSubmit: (values) => {
      console.log('[FollowUpResponses]', values);
    },
  };

  return (
    <Screening
      questions={questions}
      nextRoute="/screening2"
      startNumber={1}
      followUpModal={followUpModal}
    />
  );
};

export default ScreeningPage;

