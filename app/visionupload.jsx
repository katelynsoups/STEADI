import Upload from '../src/components/Upload';

const VisionUploadPage = () => {
    return (
        <Upload 
            test = {'vision'} 
            text = {'Watch the video tutorial for completing the vision test using your at-home kit.'}
            screenId={'vision-test'}
            route = {'/success?test=vision'}
        />
    );
};

export default VisionUploadPage;