import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';

interface LanguageSelectorProps {
  triggerStyle?: object;
  triggerTextStyle?: object;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  triggerStyle,
  triggerTextStyle,
}) => {
  const { i18n } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  const currentLang = i18n.language.startsWith('en') ? 'ENG' : 'ESP';

  const handleLanguageChange = useCallback(async (lang: 'en' | 'es') => {
    if (isChanging) {
      
      return;
    }

    setModalVisible(false);
    setIsChanging(true);

    try {
      const start = Date.now();
      await i18n.changeLanguage(lang);
      console.log('[i18n] Done in', Date.now() - start, 'ms');
    } catch (err) {
      console.error('[i18n] Failed:', err);
    } finally {
      setIsChanging(false);
    }
  }, [i18n, isChanging]);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
        disabled={isChanging}
        style={[langStyles.trigger, triggerStyle]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={[langStyles.triggerText, triggerTextStyle]}>
          {isChanging ? '...' : currentLang}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={langStyles.backdrop} onPress={() => setModalVisible(false)}>
          <View style={langStyles.popup}>
            <Text style={langStyles.popupTitle}>Select Language</Text>

            <TouchableOpacity
              style={[langStyles.option, currentLang === 'ENG' && langStyles.optionActive]}
              onPress={() => handleLanguageChange('en')}
            >
              <Text style={[langStyles.optionText, currentLang === 'ENG' && langStyles.optionTextActive]}>
                ENG — English
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[langStyles.option, currentLang === 'ESP' && langStyles.optionActive]}
              onPress={() => handleLanguageChange('es')}
            >
              <Text style={[langStyles.optionText, currentLang === 'ESP' && langStyles.optionTextActive]}>
                ESP — Español
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const langStyles = StyleSheet.create({
  trigger: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ACB5BB',
  },
  triggerText: {
    color: '#ACB5BB',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: 220,
    gap: 10,
  },
  popupTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  optionActive: {
    backgroundColor: '#E8F0FE',
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  optionText: {
    fontSize: 15,
    color: '#555',
    fontWeight: '500',
  },
  optionTextActive: {
    color: '#4A90E2',
    fontWeight: '700',
  },
});

export default LanguageSelector;