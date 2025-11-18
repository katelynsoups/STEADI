import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { saveScreeningEvent } from '../utils/eventLogger';
import { styles as appStyles } from '../styles/styles';

type AnswerOption = 'Yes' | 'No';

export type ScreeningQuestion = {
  id: string;
  prompt: string;
  whyItMatters: string;
};

type FollowUpField = {
  id: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'number' | 'select';
  options?: string[];
};

export type FollowUpModalConfig = {
  questionId: string;
  triggerAnswer: AnswerOption;
  fields: FollowUpField[];
  submitLabel?: string;
  onSubmit?: (values: Record<string, string>) => void;
};

type ScreeningProps = {
  questions: ScreeningQuestion[];
  nextRoute?: string;
  onComplete?: () => void;
  ctaLabel?: string;
  startNumber?: number;
  followUpModal?: FollowUpModalConfig;
};

// This component represents the screening questions. It can be created with any question from the data sheet.

const Screening: React.FC<ScreeningProps> = ({
  questions,
  nextRoute,
  onComplete,
  ctaLabel = 'Next',
  startNumber = 1,
  followUpModal, // This parameter is only true for screening.jsx
}) => {
  const router = useRouter();
  const [responses, setResponses] = useState<Record<string, AnswerOption | undefined>>({});
  const [activeQuestion, setActiveQuestion] = useState<ScreeningQuestion | null>(null);
  const [followUpVisible, setFollowUpVisible] = useState(false);
  const [followUpValues, setFollowUpValues] = useState<Record<string, string>>({});

  // is True when each question on the page is answered. Used for highlighting 'Next' button
  const allAnswered = useMemo(
    () => questions.every((question) => !!responses[question.id]),
    [questions, responses],
  );

  const handleSelect = (questionId: string, option: AnswerOption) => {
    setResponses((prev) => ({ ...prev, [questionId]: option }));
    saveScreeningEvent(questionId, option);

     if (
       followUpModal &&
       followUpModal.questionId === questionId &&
       followUpModal.triggerAnswer === option
     ) {
       const initialValues = followUpModal.fields.reduce<Record<string, string>>((acc, field) => {
         acc[field.id] = followUpValues[field.id] ?? '';
         return acc;
       }, {});
       setFollowUpValues(initialValues);
       setFollowUpVisible(true);
     }
  };

  const handleNext = () => {
    if (!allAnswered) return;
    if (onComplete) {
      onComplete();
      return;
    }

    if (nextRoute) {
      router.push(nextRoute);
    }
  };

  return (
    <SafeAreaView style={appStyles.safeArea}>
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={appStyles.screeningContent} showsVerticalScrollIndicator={false}>
        {questions.map((question, index) => {
          const value = responses[question.id];
          return (
            <View key={question.id} style={appStyles.screeningCard}>
              <Text style={appStyles.screeningQuestionText}>{`${startNumber + index}. ${question.prompt}`}</Text>
              <TouchableOpacity style={appStyles.screeningWhyItMatters} onPress={() => setActiveQuestion(question)}>
                <Text style={appStyles.screeningWhyText}>Why it matters</Text>
                <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
              </TouchableOpacity>

              <View style={appStyles.screeningOptionRow}>
                {(['Yes', 'No'] as AnswerOption[]).map((option) => {
                  const selected = value === option;
                  return (
                    <TouchableOpacity
                      key={option}
                      onPress={() => handleSelect(question.id, option)}
                      style={appStyles.screeningOptionButton}
                      activeOpacity={0.8}
                    >
                      <View style={[appStyles.screeningBubble, selected && appStyles.screeningBubbleSelected]}>
                        {selected && <View style={appStyles.screeningBubbleDot} />}
                      </View>
                      <Text style={appStyles.screeningOptionLabel}>{option}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}

        {/* Next button highlights when const allAnswered is True */}
        <TouchableOpacity
          style={[appStyles.blueNextButton, !allAnswered && appStyles.nextButtonDisabled]}
          activeOpacity={0.9}
          onPress={handleNext}
          disabled={!allAnswered}
        >
          <Text style={appStyles.blueButtonText}>{ctaLabel}</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={!!activeQuestion}
        animationType="fade"
        transparent
        onRequestClose={() => setActiveQuestion(null)}
      >
        <Pressable style={screeningStyles.modalBackdrop} onPress={() => setActiveQuestion(null)}>
          <Pressable style={screeningStyles.modalCard}>
            <Text style={screeningStyles.modalText}>{activeQuestion?.whyItMatters}</Text>
            <TouchableOpacity style={screeningStyles.modalButton} onPress={() => setActiveQuestion(null)}>
              <Text style={screeningStyles.modalButtonText}>Got it</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* This section is for the follow-up modal that appears on the first screen first question if answered 'Yes' */}
      {followUpModal && (
        <Modal
          visible={followUpVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setFollowUpVisible(false)}
        >
          <Pressable style={screeningStyles.followUpBackdrop} onPress={() => setFollowUpVisible(false)}>
            <Pressable style={screeningStyles.followUpCard}>
              {followUpModal.fields.map((field) => (
                <View key={field.id} style={screeningStyles.followUpField}>
                  <Text style={screeningStyles.followUpLabel}>{field.label}</Text>
                  {field.type === 'select' && field.options ? (
                    <View style={screeningStyles.followUpOptions}>
                      {field.options.map((option) => {
                        const selected = followUpValues[field.id] === option;
                        return (
                          <TouchableOpacity
                            key={option}
                            style={[
                              screeningStyles.followUpOption,
                              selected && screeningStyles.followUpOptionSelected,
                            ]}
                            onPress={() =>
                              setFollowUpValues((prev) => ({ ...prev, [field.id]: option }))
                            }
                          >
                            <Text
                              style={[
                                screeningStyles.followUpOptionText,
                                selected && screeningStyles.followUpOptionTextSelected,
                              ]}
                            >
                              {option}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ) : (
                    <TextInput
                      style={screeningStyles.followUpInput}
                      placeholder={field.placeholder}
                      keyboardType={field.type === 'number' ? 'numeric' : 'default'}
                      value={followUpValues[field.id] ?? ''}
                      onChangeText={(text) =>
                        setFollowUpValues((prev) => ({ ...prev, [field.id]: text }))
                      }
                    />
                  )}
                </View>
              ))}

              <TouchableOpacity
                style={screeningStyles.followUpSubmit}
                onPress={() => {
                  followUpModal.onSubmit?.(followUpValues);
                  setFollowUpVisible(false);
                }}
              >
                <Text style={appStyles.blueButtonText}>
                  {followUpModal.submitLabel ?? 'Submit'}
                </Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </SafeAreaView>
  );
};

// These styles are specific to the Screening component and do not need to be in the global style sheet
const screeningStyles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
  },
  modalText: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 24,
  },
  modalButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#172063',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  followUpBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  followUpCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
  },
  followUpField: {
    marginBottom: 18,
  },
  followUpLabel: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 12,
    textAlign: 'center',
  },
  followUpInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    textAlign: 'center',
    color: '#111827',
  },
  followUpOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  followUpOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  followUpOptionSelected: {
    borderColor: '#172063',
    backgroundColor: '#172063',
  },
  followUpOptionText: {
    fontSize: 16,
    color: '#111827',
  },
  followUpOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  followUpSubmit: {
    marginTop: 12,
    backgroundColor: '#172063',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
});

export default Screening;

