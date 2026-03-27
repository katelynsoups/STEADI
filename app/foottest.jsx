import FootTest from '../src/components/FootTest';
import { updateSaveStatus } from '../src/utils/saveUnit';

const FootTestPage = () => {

    updateSaveStatus('/foottest');

    return (
        <FootTest />
    );
};

export default FootTestPage;