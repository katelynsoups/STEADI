import FootTestInstruct from '../src/components/FootTestInstruct';
import { updateSaveStatus } from '../src/utils/saveUnit';

const FootTestInstructPage = () => {

    updateSaveStatus('/foottestinstruct');
    
    return (
        <FootTestInstruct />
    );
};

export default FootTestInstructPage;