import Upload from '../src/components/Upload';

const visionVid = require('../src/assets/STEADItestvid.mp4');

const VisionUploadPage = () => {
    return (
        <Upload 
            test = {'vision'} 
            text = {'Watch the video tutorial for completing the vision test using your at-home kit.'}
            vid = {visionVid}
            route = {'/visionsuccess'}
        />
    );
};

export default VisionUploadPage;