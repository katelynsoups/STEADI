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
      whyItMatters: 'Using an assistive device can be a sign of balance or strength challenges.',
    },
  ],
  [
    {
      id: 'unsteady',
      prompt: 'Sometimes I feel unsteady when walking.',
      whyItMatters: 'Feeling unsteady increases the likelihood of slips and trips.',
    },
    {
      id: 'worried',
      prompt: 'I worry about falling.',
      whyItMatters: 'Fear of falling can lead to inactivity, which weakens muscles and raises risk.',
    },
  ],
  [
    {
      id: 'handsToStand',
      prompt: 'I need to push with my hands to stand up from a chair.',
      whyItMatters: 'Needing your hands to stand signals weaker leg muscles, a fall predictor.',
    },
    {
      id: 'curb',
      prompt: 'I have trouble stepping up onto a curb.',
      whyItMatters: 'Difficulty with curbs shows lower-body weakness and balance issues.',
    },
  ],
  [
    {
      id: 'numbFeet',
      prompt: 'I have lost some feeling in my feet.',
      whyItMatters: 'Numbness in the feet makes it harder to sense the ground and stay stable.',
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
      whyItMatters: 'Some medications affect alertness or balance, increasing fall risk.',
    },
    {
      id: 'sleepMeds',
      prompt: 'I take medicine to help me sleep or improve my mood.',
      whyItMatters: 'Sleep and mood medicines can slow reaction time or worsen balance.',
    },
  ],
  [
    {
      id: 'sad',
      prompt: 'I often feel sad or depressed.',
      whyItMatters: 'Depression can reduce activity levels, which weakens muscles over time.',
    },
    {
      id: 'rushBathroom',
      prompt: 'I have to rush to the toilet.',
      whyItMatters: 'Rushing increases the chance of slips, especially at night.',
    },
  ],
];

export const getScreeningQuestionsForStep = (stepIndex: number) =>
  screeningQuestionSets[stepIndex] ?? [];

