import MedicationUpload from '../src/components/MedicationUpload';
import { updateSaveStatus } from '../src/utils/saveUnit';

const MedicationUploadPage = () => {

    updateSaveStatus('/medicationupload');
    
    return (
        <MedicationUpload />
    );
};

export default MedicationUploadPage;