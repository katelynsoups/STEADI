import React, { useState } from 'react';
import { styles } from '../styles/styles';
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import medicationList from '../utils/medications.json';

const MedicationTextUpload = () => {
  const router = useRouter();

  // manual entry
  const [inputText, setInputText] = useState('');
  const [medications, setMedications] = useState<string[][]>([]);

  // reuse same extraction logic
  const extractMedication = (text: string): string | null => {
    const words = text
      .toLowerCase()
      .split(/[\s,;.!?]+/)
      .map(word => word.replace(/[^a-z]/g, ''));

    const medicationSet = new Set(medicationList);

    for (const word of words) {
      if (word.length > 2 && medicationSet.has(word)) {
        return word;
      }
    }

    return null;
  };

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      Alert.alert('Missing medication name');
      return;
    }

    const medicationName = extractMedication(inputText);

    if (!medicationName) {
      Alert.alert(
        'Medication not recognized',
        'Please check the spelling and try again.'
      );
      return;
    }

    //fix to actual store in the database
    setMedications(prev => [...prev, [medicationName, 'manual']]);

    router.push({
      pathname: '/medicationresults',
      params: { medicationName },
    });
  };

  return (
    <View style={styles.background}>
      <Text style={[styles.inputHeader, { marginBottom: 16 }]}>
        Please enter the medication name exactly as it appears on the label.
      </Text>

      <View style={{ width: '95%', marginBottom: 16 }}>
        <TextInput
          style={[styles.input, { backgroundColor: 'white' }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="e.g. Lisinopril"
          placeholderTextColor="#6B7280"
          autoCapitalize="words"
        />
      </View>

      <TouchableOpacity
        style={styles.blueNextButton}
        onPress={handleSubmit}
      >
        <Text style={styles.btnText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MedicationTextUpload;
