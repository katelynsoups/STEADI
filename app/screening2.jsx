import React from 'react';
import Screening from '../src/components/Screening';
import { getScreeningQuestionsForStep } from '../src/data/screeningQuestions';
import { updateSaveStatus } from '../src/utils/saveUnit';

const Screening2Page = () => {
  const questions = getScreeningQuestionsForStep(1);

  updateSaveStatus(`/screening2`);

  return <Screening questions={questions} nextRoute="/screening3" startNumber={3} />;
};

export default Screening2Page;

