import Upload from '../src/components/Upload';
import { updateSaveStatus } from '../src/utils/saveUnit';

const VisionTestLeft = () => {

    updateSaveStatus('/visiontestleft');
    
    return (
        <Upload 
            test={'vision'} 
            text={'Please complete the vision assessment while covering your RIGHT eye and reading the letters clearly.'}
            boldPhrase={'covering your RIGHT eye'}
            screenId={'vision-test'}
            side={'left'}  
            route={'/visiontestright'}
        />
    );
};

export default VisionTestLeft;