import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { styles as appStyles } from '../styles/styles';
import { updateSaveStatus } from '../utils/saveUnit';

type ScreeningResultProps = {
  bodyHeader?: string;
  bodyText: string;
};

const ScreeningResult: React.FC<ScreeningResultProps> = ({ bodyHeader, bodyText }) => {
  updateSaveStatus();
  const bodyTextGroups = bodyText.split(".");

  return (
    <ScrollView
      style={resultStyles.scroll}
      contentContainerStyle={resultStyles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={[resultStyles.content, {alignItems: 'center'}]}>
        {bodyHeader ? <Text style={appStyles.inputHeader}>{bodyHeader}</Text> : null}

        { bodyTextGroups.map((group) => (
          <Text key = {group} style={[resultStyles.bodyText, {}]}>{group}</Text>
        ))}

      </View>
    </ScrollView>
  );
};

// we use different font size than default here because the screen is so empty
const resultStyles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
  },
  bodyText: {
    fontSize: 18,
    color: '#111827',
    lineHeight: 28,
    marginBottom: '15%', 
    textAlign: 'center'
  },
});

export default ScreeningResult;
