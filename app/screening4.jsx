import React from 'react';
import Screening from '../src/components/Screening';
import { getScreeningQuestionsForStep } from '../src/data/screeningQuestions';
import { updateSaveStatus } from '../src/utils/saveUnit';

const Screening4Page = () => {
  const questions = getScreeningQuestionsForStep(3);

  updateSaveStatus(`/screening4`);

  return <Screening questions={questions} nextRoute="/screening5" startNumber={7} />;
};

export default Screening4Page;

