import React from 'react';
import Screening from '../src/components/Screening';
import { getScreeningQuestionsForStep } from '../src/data/screeningQuestions';

const Screening5Page = () => {
  const questions = getScreeningQuestionsForStep(4);
  return <Screening questions={questions} nextRoute="/screening6" startNumber={9} />;
};

export default Screening5Page;

