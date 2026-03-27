import React from 'react';
import VitaminDTestInstruct from '../src/components/VitaminDTestInstruct';
import { updateSaveStatus } from '../src/utils/saveUnit';

const VitaminDTestInstructPage = () => {

    updateSaveStatus('/vitamindtestinstruct');

    return (
        <VitaminDTestInstruct 
            screenId={'vitamin-d-test'}
        />
    );
};

export default VitaminDTestInstructPage;