import React from 'react';
import { useRouter } from 'expo-router';
import Screening from '../src/components/Screening';
import { getScreeningQuestionsForStep } from '../src/data/screeningQuestions';
import { isAtRisk } from '../src/utils/eventLogger';
import { updateSaveStatus } from '../src/utils/saveUnit';
import { useTranslation } from 'react-i18next';

const Screening6Page = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const questions = getScreeningQuestionsForStep(5);

  updateSaveStatus(`/screening6`);

  const handleComplete = () => {
    const atRisk = isAtRisk();
    router.push({ pathname: '/screeningresult', params: { atRisk: atRisk ? 'true' : 'false' } });
  };

  return (
    <Screening
      questions={questions}
      ctaLabel={t('screening.finishButton')}
      onComplete={handleComplete}
      startNumber={11}
    />
  );
};

export default Screening6Page;

