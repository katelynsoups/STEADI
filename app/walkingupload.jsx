import Upload from '../src/components/Upload';
import { updateSaveStatus } from '../src/utils/saveUnit';

const TimedUpAndGoUpload = () => {

    updateSaveStatus('/walkingupload');

    return (
        <Upload
            test = {'walking'}
            text = {'Watch the video tutorial for completing the Up & Go test.'}
            screenId = {'walking-test'}
            route = {'/walkingsuccess'}
        />
    );
};

export default TimedUpAndGoUpload;