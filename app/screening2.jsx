import React from 'react';
import Screening from '../src/components/Screening';
import { getScreeningQuestionsForStep } from '../src/data/screeningQuestions';

const Screening2Page = () => {
  const questions = getScreeningQuestionsForStep(1);
  return <Screening questions={questions} nextRoute="/screening3" startNumber={3} />;
};

export default Screening2Page;

