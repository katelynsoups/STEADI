import { ScreeningQuestion } from '../components/Screening';

export const screeningQuestionSets: ScreeningQuestion[][] = [
  [
    {
      id: 'fallen',
      prompt: 'screeningQuestions.q1.prompt',
      whyItMatters: 'screeningQuestions.q1.whyItMatters',
    },
    {
      id: 'cane',
      prompt: 'screeningQuestions.q2.prompt',
      whyItMatters: 'screeningQuestions.q2.whyItMatters',
    },
  ],
  [
    {
      id: 'unsteady',
      prompt: 'screeningQuestions.q3.prompt',
      whyItMatters: 'screeningQuestions.q3.whyItMatters',
    },
    {
      id: 'worried',
      prompt: 'screeningQuestions.q4.prompt',
      whyItMatters: 'screeningQuestions.q4.whyItMatters',
    },
  ],
  [
    {
      id: 'handsToStand',
      prompt: 'screeningQuestions.q5.prompt',
      whyItMatters: 'screeningQuestions.q5.whyItMatters',
    },
    {
      id: 'curb',
      prompt: 'screeningQuestions.q6.prompt',
      whyItMatters: 'screeningQuestions.q6.whyItMatters',
    },
  ],
  [
    {
      id: 'numbFeet',
      prompt: 'screeningQuestions.q7.prompt',
      whyItMatters: 'screeningQuestions.q7.whyItMatters',
    },
    {
      id: 'lightheaded',
      prompt: 'screeningQuestions.q8.prompt',
      whyItMatters: 'screeningQuestions.q8.whyItMatters',
    },
  ],
  [
    {
      id: 'medDizzy',
      prompt: 'screeningQuestions.q9.prompt',
      whyItMatters: 'screeningQuestions.q9.whyItMatters',
    },
    {
      id: 'sleepMeds',
      prompt: 'screeningQuestions.q10.prompt',
      whyItMatters: 'screeningQuestions.q10.whyItMatters',
    },
  ],
  [
    {
      id: 'sad',
      prompt: 'screeningQuestions.q11.prompt',
      whyItMatters: 'screeningQuestions.q11.whyItMatters',
    },
    {
      id: 'rushBathroom',
      prompt: 'screeningQuestions.q12.prompt',
      whyItMatters: 'screeningQuestions.q12.whyItMatters',
    },
  ],
];

export const getScreeningQuestionsForStep = (stepIndex: number) =>
  screeningQuestionSets[stepIndex] ?? [];

/** this map has all 12 screening question IDs in order for fall risk scoring. */
export const allScreeningQuestionIds: string[] = screeningQuestionSets.flatMap((set) =>
  set.map((q) => q.id)
);
