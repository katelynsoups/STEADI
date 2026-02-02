import React from 'react';
import { useRouter } from 'expo-router';
import Screening from '../src/components/Screening';
import { getScreeningQuestionsForStep } from '../src/data/screeningQuestions';
import { isAtRisk } from '../src/utils/eventLogger';

const Screening6Page = () => {
  const router = useRouter();
  const questions = getScreeningQuestionsForStep(5);

  const handleComplete = () => {
    const atRisk = isAtRisk();
    router.push({ pathname: '/screeningresult', params: { atRisk: atRisk ? 'true' : 'false' } });
  };

  return (
    <Screening
      questions={questions}
      ctaLabel="Finish"
      onComplete={handleComplete}
      startNumber={11}
    />
  );
};

export default Screening6Page;

