import React from 'react';
import Screening, { FollowUpModalConfig } from '../src/components/Screening';
import { getScreeningQuestionsForStep } from '../src/data/screeningQuestions';
import { updateSaveStatus } from '../src/utils/saveUnit';
import { useTranslation } from 'react-i18next';

const ScreeningPage = () => {
  const questions = getScreeningQuestionsForStep(0);
  const { t } = useTranslation();

  updateSaveStatus(`/screening`);

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

