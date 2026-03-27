import MedicationResult from '../src/components/MedicationResult';
import { updateSaveStatus } from '../src/utils/saveUnit';

const MedicationResultPage = () => {

    updateSaveStatus('/medicationresults');

    return (
        <MedicationResult />
    );
};

export default MedicationResultPage;