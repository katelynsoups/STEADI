import React from 'react';
import { useRouter } from 'expo-router';
import Screening from '../src/components/Screening';
import { getScreeningQuestionsForStep } from '../src/data/screeningQuestions';

const Screening6Page = () => {
  const router = useRouter();
  const questions = getScreeningQuestionsForStep(5);

  return (
    <Screening
      questions={questions}
      ctaLabel="Finish"
      onComplete={() => router.push('/shortcut')}
      startNumber={11}
    />
  );
};

export default Screening6Page;

