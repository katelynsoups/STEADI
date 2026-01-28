import { ScreeningQuestion } from '../components/Screening';

export const screeningQuestionSets: ScreeningQuestion[][] = [
  [
    {
      id: 'fallen',
      prompt: 'I have fallen in the past year.',
      whyItMatters: 'People who have fallen once are likely to fall again.',
    },
    {
      id: 'cane',
      prompt: 'I use or have been advised to use a cane or walker to get around safely.',
      whyItMatters: 'People who have been advised to use a cane or walker may already be more likely to fall.',
    },
  ],
  [
    {
      id: 'unsteady',
      prompt: 'Sometimes I feel unsteady when walking.',
      whyItMatters: 'Unsteadiness or needing support while walking are signs of poor balance.',
    },
    {
      id: 'worried',
      prompt: 'I worry about falling.',
      whyItMatters: 'People who are worried about falling are more likely to fall.',
    },
  ],
  [
    {
      id: 'handsToStand',
      prompt: 'I need to push with my hands to stand up from a chair.',
      whyItMatters: 'This is a sign of weak leg muscles, a major reason for falling.',
    },
    {
      id: 'curb',
      prompt: 'I have trouble stepping up onto a curb.',
      whyItMatters: 'This is a sign of weak leg muscles, a major reason for falling.',
    },
  ],
  [
    {
      id: 'numbFeet',
      prompt: 'I have lost some feeling in my feet.',
      whyItMatters: 'Numbness in your feet can cause stumbles and lead to falls.',
    },
    {
      id: 'lightheaded',
      prompt: 'I often feel light-headed when getting up.',
      whyItMatters: 'Light-headedness can cause sudden drops in blood pressure that lead to falls.',
    },
  ],
  [
    {
      id: 'medDizzy',
      prompt: 'I take medicine that makes me feel tired or dizzy.',
      whyItMatters: 'Side effects from medicines can sometimes increase your chance of falling.',
    },
    {
      id: 'sleepMeds',
      prompt: 'I take medicine to help me sleep or improve my mood.',
      whyItMatters: 'These medicines can sometimes increase your chance of falling.',
    },
  ],
  [
    {
      id: 'sad',
      prompt: 'I often feel sad or depressed.',
      whyItMatters: 'Symptoms of depression, such as not feeling well or feeling slowed down, are linked to falls.',
    },
    {
      id: 'rushBathroom',
      prompt: 'I have to rush to the toilet.',
      whyItMatters: 'Rushing to the bathroom, especially at night, increases your chance of falling.',
    },
  ],
];

export const getScreeningQuestionsForStep = (stepIndex: number) =>
  screeningQuestionSets[stepIndex] ?? [];

/** this map has all 12 screening question IDs in order for fall risk scoring. */
export const allScreeningQuestionIds: string[] = screeningQuestionSets.flatMap((set) =>
  set.map((q) => q.id)
);
