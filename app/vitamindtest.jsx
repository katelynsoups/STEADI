import React from 'react';
import VitaminDTest from '../src/components/VitaminDTest';
import { updateSaveStatus } from '../src/utils/saveUnit';

const VitaminDTestPage = () => {

    updateSaveStatus('/vitamindtest');
    
    return (
        <VitaminDTest />
    );
};

export default VitaminDTestPage;