import FootTestRight from '../src/components/RightFootTest';
import { updateSaveStatus } from '../src/utils/saveUnit';

const FootTestPage = () => {

    updateSaveStatus('/foottestright');

    return (
        <FootTestRight />
    );
};

export default FootTestPage;