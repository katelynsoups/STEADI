import React from 'react';
import Screening from '../src/components/Screening';
import { getScreeningQuestionsForStep } from '../src/data/screeningQuestions';

const Screening3Page = () => {
  const questions = getScreeningQuestionsForStep(2);
  return <Screening questions={questions} nextRoute="/screening4" startNumber={5} />;
};

export default Screening3Page;

