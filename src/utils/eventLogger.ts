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

