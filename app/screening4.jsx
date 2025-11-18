import React from 'react';
import Screening from '../src/components/Screening';
import { getScreeningQuestionsForStep } from '../src/data/screeningQuestions';

const Screening4Page = () => {
  const questions = getScreeningQuestionsForStep(3);
  return <Screening questions={questions} nextRoute="/screening5" startNumber={7} />;
};

export default Screening4Page;

