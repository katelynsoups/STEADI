import { allScreeningQuestionIds } from '../data/screeningQuestions';

type ScreeningResponse = 'Yes' | 'No';

export interface ScreeningEvent {
  questionId: string;
  response: ScreeningResponse;
  timestamp: number;
}

const inMemoryEvents: ScreeningEvent[] = [];

export const saveScreeningEvent = (questionId: string, response: ScreeningResponse) => {
  const event: ScreeningEvent = {
    questionId,
    response,
    timestamp: Date.now(),
  };

  inMemoryEvents.push(event);
  console.log('[ScreeningEvent]', event);
  return event;
};

export const getScreeningEvents = () => [...inMemoryEvents];

// latest response per question (by timestamp). this will be used when user navigates back and re-answers
function getLatestResponses(): Map<string, ScreeningResponse> {
  const byQuestion = new Map<string, ScreeningEvent>();
  for (const e of inMemoryEvents) {
    if (!allScreeningQuestionIds.includes(e.questionId)) continue;
    const existing = byQuestion.get(e.questionId);
    if (!existing || e.timestamp > existing.timestamp) {
      byQuestion.set(e.questionId, e);
    }
  }
  const out = new Map<string, ScreeningResponse>();
  byQuestion.forEach((ev, id) => out.set(id, ev.response));
  return out;
}

// fall risk score = count of "Yes" across the 12 screening questions
export const getFallRiskScore = (): number => {
  const latest = getLatestResponses();
  return allScreeningQuestionIds.filter((id) => latest.get(id) === 'Yes').length;
};

// key questions that always flag user as at-risk when answered "Yes"
const KEY_QUESTION_IDS = ['fallen', 'worried', 'unsteady'] as const;

// true if any key risk-factor question was answered "Yes"
export const hasKeyRiskFactors = (): boolean => {
  const latest = getLatestResponses();
  return KEY_QUESTION_IDS.some((id) => latest.get(id) === 'Yes');
};

/**
 * at risk flag:
 * - score >= 4 (4+ "Yes" answers overall), OR
 * - any key risk-factor question is answered "Yes"
 */
export const isAtRisk = (): boolean => hasKeyRiskFactors() || getFallRiskScore() >= 4;

