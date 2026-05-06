import VideoInstruction from '../src/components/VideoInstruction';
import { updateSaveStatus } from '../src/utils/saveUnit';

const FootTestInstructPage = () => {

    updateSaveStatus('/foottestinstruct');
    
    return (
        <VideoInstruction
            test = {'foot'} 
            text1 = {'Watch the video tutorial for completing the foot neuropathy test using the monofilament in the at-home kit.'}
            text2 = {''}
            screenId={'foot-test'}
            nextRoute = {'/foottestleft'}
        />
    );
};

export default FootTestInstructPage;