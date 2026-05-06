import FootTestLeft from '../src/components/LeftFootTest';
import { updateSaveStatus } from '../src/utils/saveUnit';

const FootTestPage = () => {

    updateSaveStatus('/foottestleft');

    return (
        <FootTestLeft />
    );
};

export default FootTestPage;