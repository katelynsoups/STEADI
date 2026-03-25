import Upload from '../src/components/Upload';

const TimedUpAndGoUpload = () => {
    return (
        <Upload
            test = {'walking'}
            text = {'Watch the video tutorial for completing the Up & Go test.'}
            screenId = {'walking-test'}
            route = {'/success?test=walking'}
        />
    );
};

export default TimedUpAndGoUpload;