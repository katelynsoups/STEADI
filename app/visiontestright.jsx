import Upload from '../src/components/Upload';
import { updateSaveStatus } from '../src/utils/saveUnit';

const VisionTestRight = () => {

    updateSaveStatus('/visiontestright');
    
    return (
        <Upload 
            test = {'vision'} 
            text = {'Great job!\n\nNow please complete the vision assessment while covering your LEFT eye and reading the letters clearly.'}
            boldPhrase={'covering your LEFT eye'}
            screenId={'vision-test'}
            side={'right'}  
            route = {'/success?test=vision'}
        />
    );
};

export default VisionTestRight;