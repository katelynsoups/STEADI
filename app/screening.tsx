import React from 'react';
import Screening, { FollowUpModalConfig } from '../src/components/Screening';
import { getScreeningQuestionsForStep } from '../src/data/screeningQuestions';
import { updateSaveStatus } from '../src/utils/saveUnit';

const ScreeningPage = () => {
  const questions = getScreeningQuestionsForStep(0);

  updateSaveStatus(`/screening`);

  //changes this file to tsx to allow types for the modal
  const followUpModal: FollowUpModalConfig = {
    questionId: 'fallen',
    triggerAnswer: 'Yes',
    submitLabel: 'Submit',
    fields: [
      {
        id: 'fallCount',
        label: 'How many times have you fallen in the past week?',
        placeholder: '0',
        type: 'number',
      },
      {
        id: 'injured',
        label: 'Were you injured?',
        type: 'select',
        options: ['Yes', 'No'],
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

