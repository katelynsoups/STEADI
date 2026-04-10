import React from 'react';
import { updateSaveStatus } from '../src/utils/saveUnit';
import VideoInstruction from '../src/components/VideoInstruction';

const VitaminDTestInstructPage = () => {

    updateSaveStatus('/vitamindtestinstruct');

    return (
        //switching to use a shared component for video instruction screens
        <VideoInstruction
            test = {'vitaminD'} 
            text1 = {'Watch the video tutorial for completing the vitamin D test using your at-home kit.'}
            text2 = {'Once completed, set the test aside for later. Results take approximately 20 minutes to appear. You will be asked to provide results at the end of this session.'}
            screenId={'vitamin-d-test'}
            nextRoute = {'/bloodtest'}
        />
    );
};

export default VitaminDTestInstructPage;