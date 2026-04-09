import React from 'react';
import AssessComplete from '../src/components/AssessComplete';
import { updateSaveStatus } from '../src/utils/saveUnit';

const AssessCompletePage = () => {

    updateSaveStatus('/assesscomplete');
    
    return (
        <AssessComplete />
    );
};

export default AssessCompletePage;