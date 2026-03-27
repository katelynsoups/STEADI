import MedicationTypedUpload from '../src/components/MedicationTypedUpload';
import { updateSaveStatus } from '../src/utils/saveUnit';

const MedicationTypedUploadPage = () => {

    updateSaveStatus('/medicationtypedupload');
    
    return (
        <MedicationTypedUpload />
    );
};

export default MedicationTypedUploadPage;