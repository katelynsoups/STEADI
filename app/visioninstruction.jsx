import React from 'react';
import { updateSaveStatus } from '../src/utils/saveUnit';
import VideoInstruction from '../src/components/VideoInstruction';

const VisionInstruction = () => {

    updateSaveStatus('/visioninstruction');

    return (
        //switching to use a shared component for video instruction screens
        <VideoInstruction
            test = {'vision'} 
            text1 = {'Watch the video tutorial for completing the vision test using your at-home kit.'}
            text2 = {'You will be asked to upload one vision assessment per eye on the following screens.\n\nPlease select next to continue.'}
            screenId={'vision-test'}
            nextRoute = {'/visiontestleft'}
        />
    );
};

export default VisionInstruction;