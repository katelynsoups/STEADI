import React from 'react';
import { View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from '../styles/styles';
import EducationalResourceSection from './EducationalResourceSection';
import { STEADI_BROCHURES, STEADI_FACT_SHEETS } from '../data/educationalResources';

const EducationalResources = () => {
    const { t } = useTranslation();
    return (
        <View style={[styles.background, { paddingHorizontal: 0 }]}>
            <ScrollView
                style={{ flex: 1, width: '100%', alignSelf: 'stretch' }}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 8,
                    paddingBottom: 32,
                    flexGrow: 1,
                    alignItems: 'center',
                }}
                showsVerticalScrollIndicator={false}
            >
                <EducationalResourceSection heading={t('layout.educationalBrochures')} items={STEADI_BROCHURES} />
                <EducationalResourceSection heading={t('layout.educationalFactSheets')} items={STEADI_FACT_SHEETS} />
            </ScrollView>
        </View>
    );
};

export default EducationalResources;
