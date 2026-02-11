import Upload from '../src/components/Upload';

const visionVid = require('../src/assets/STEADItestvid.mp4');

const TimedUpAndGoUpload = () => {
    return (
        <Upload
            test = {'walking'}
            text = {'Watch the video tutorial for completing the Up & Go test.'}
            vid = {visionVid}
            route = {'/login'}
        />
    );
};

export default TimedUpAndGoUpload;