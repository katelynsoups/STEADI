import HomeHazards, {buttonStats} from '../src/components/HomeHazards';
import { getHazards } from '../src/data/hazardQuestions';
import { updateSaveStatus } from '../src/utils/saveUnit';

const HomeHazards2Page = () => {
    const hazards = getHazards(1);

    updateSaveStatus('/homehazards2');

    return (
        <HomeHazards questions = {hazards} next = {'/foottestinstruct'}/>
    );
};

export default HomeHazards2Page;