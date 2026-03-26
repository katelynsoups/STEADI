import React from 'react';
import BloodTest from '../src/components/BloodTest';
import { updateSaveStatus } from '../src/utils/saveUnit';

const BloodTestPage = () => {

    updateSaveStatus('/bloodtest');
    
    return (
        <BloodTest 
            screenId={'blood-pressure-test'}
        />
    );
};

export default BloodTestPage;